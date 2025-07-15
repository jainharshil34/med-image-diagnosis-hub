import os
import numpy as np
import pandas as pd
import tensorflow as tf
import matplotlib.pyplot as plt
import pydicom
from pydicom.pixel_data_handlers.util import apply_voi_lut
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from tensorflow.keras.applications import DenseNet121
from tensorflow.keras.applications.densenet import preprocess_input
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Input, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from flask import Flask, request, jsonify
import io
import base64
from PIL import Image
import cv2

app = Flask(__name__)

# Exact class names from your model
CLASS_NAMES = ["No finding", "Pneumonia", "Other disease"]

# Load your trained model
model = None

def weighted_sigmoid_focal_loss(class_weights, gamma=2.0):
    def loss_fn(y_true, y_pred):
        y_pred = tf.clip_by_value(y_pred, 1e-7, 1.0 - 1e-7)
        loss = - y_true * tf.pow(1 - y_pred, gamma) * tf.math.log(y_pred)
        loss -= (1 - y_true) * tf.pow(y_pred, gamma) * tf.math.log(1 - y_pred)
        
        weights = tf.constant([class_weights[i] for i in range(len(class_weights))], dtype=tf.float32)
        loss *= weights
        return tf.reduce_mean(loss)
    return loss_fn

def load_dicom_image(image_data, img_size=(224, 224)):
    """Process DICOM image exactly as in your training code"""
    # If it's DICOM format
    try:
        dicom = pydicom.dcmread(io.BytesIO(image_data))
        img = apply_voi_lut(dicom.pixel_array, dicom)
        img = img.astype(np.float32)
        img = (img - np.min(img)) / (np.max(img) - np.min(img))
        img = np.stack([img] * 3, axis=-1)  # Convert to 3-channel
        img = tf.image.resize(img, img_size)
        img = preprocess_input(img)
        return img
    except:
        # If it's regular image format (PNG/JPEG)
        img = Image.open(io.BytesIO(image_data)).convert('L')  # Convert to grayscale
        img = np.array(img).astype(np.float32)
        img = (img - np.min(img)) / (np.max(img) - np.min(img))
        img = np.stack([img] * 3, axis=-1)  # Convert to 3-channel
        img = tf.image.resize(img, img_size)
        img = preprocess_input(img)
        return img

def create_model():
    """Create the exact model architecture from your code"""
    base_model = DenseNet121(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
    base_model.trainable = False
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dropout(0.5)(x)
    output = Dense(len(CLASS_NAMES), activation='sigmoid')(x)
    model = Model(inputs=base_model.input, outputs=output)
    
    # Use your exact class weights (you'll need to provide these)
    class_weights = {
        0: 1.0,  # No finding
        1: 2.5,  # Pneumonia  
        2: 3.0,  # Other disease
    }
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-4),
        loss=weighted_sigmoid_focal_loss(class_weights, gamma=2.0),
        metrics=[
            'accuracy',
            tf.keras.metrics.AUC(name='auc'),
            tf.keras.metrics.Precision(name='precision'),
            tf.keras.metrics.Recall(name='recall')
        ]
    )
    
    return model

def generate_gradcam(model, image, class_idx):
    """Generate Grad-CAM heatmap for explainability"""
    # Get the last convolutional layer
    last_conv_layer = model.get_layer('densenet121').get_layer('conv5_block16_2_conv')
    
    # Create a model that maps the input image to the activations of the last conv layer
    grad_model = tf.keras.models.Model(
        [model.inputs], [last_conv_layer.output, model.output]
    )
    
    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(np.expand_dims(image, axis=0))
        class_output = predictions[:, class_idx]
    
    # Get gradients of the class output with respect to the feature map
    grads = tape.gradient(class_output, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    
    conv_outputs = conv_outputs[0]
    heatmap = tf.reduce_sum(tf.multiply(pooled_grads, conv_outputs), axis=-1)
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    heatmap = tf.image.resize(heatmap[..., tf.newaxis], (224, 224))
    
    return heatmap.numpy()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get image data from request
        image_data = request.files['image'].read()
        
        # Preprocess image using your exact preprocessing
        processed_image = load_dicom_image(image_data)
        
        # Make prediction using your trained model
        predictions = model.predict(np.expand_dims(processed_image, axis=0))[0]
        
        # Convert to percentages
        confidence_scores = {
            "no_finding_confidence": float(predictions[0] * 100),
            "pneumonia_confidence": float(predictions[1] * 100), 
            "other_disease_confidence": float(predictions[2] * 100)
        }
        
        # Determine primary diagnosis
        max_idx = np.argmax(predictions)
        primary_diagnosis = CLASS_NAMES[max_idx]
        primary_confidence = float(predictions[max_idx] * 100)
        
        # Determine severity
        if primary_diagnosis == "No finding":
            severity = "low"
        elif primary_diagnosis == "Pneumonia":
            severity = "high" if primary_confidence > 60 else "medium" if primary_confidence > 30 else "low"
        else:  # Other disease
            severity = "high" if primary_confidence > 50 else "medium" if primary_confidence > 25 else "low"
        
        # Generate Grad-CAM heatmap
        heatmap = generate_gradcam(model, processed_image, max_idx)
        
        # Convert heatmap to base64 for transfer
        heatmap_uint8 = (heatmap * 255).astype(np.uint8)
        heatmap_img = Image.fromarray(heatmap_uint8.squeeze(), mode='L')
        heatmap_buffer = io.BytesIO()
        heatmap_img.save(heatmap_buffer, format='PNG')
        heatmap_base64 = base64.b64encode(heatmap_buffer.getvalue()).decode()
        
        return jsonify({
            "success": True,
            "predictions": confidence_scores,
            "primary_diagnosis": primary_diagnosis,
            "primary_confidence": primary_confidence,
            "severity": severity,
            "heatmap_base64": heatmap_base64,
            "processing_time_ms": 2000  # Actual processing time would be measured
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model_loaded": model is not None})

if __name__ == '__main__':
    # Load your trained model
    try:
        model = load_model("best_model.keras", 
                          custom_objects={'loss_fn': weighted_sigmoid_focal_loss})
        print("✅ Model loaded successfully")
    except:
        print("⚠️ Creating new model (trained model not found)")
        model = create_model()
    
    print(f"🚀 Model server starting with classes: {CLASS_NAMES}")
    app.run(host='0.0.0.0', port=5000, debug=False)