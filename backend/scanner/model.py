"""
Machine Learning Model for URL Classification

Optional ML model using scikit-learn for enhanced malicious URL detection.
Can be trained on a dataset of malicious and benign URLs.
"""

import pickle
import os
from typing import Optional, Tuple
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

from .features import extract_all_features


class URLClassifier:
    """
    Machine Learning classifier for URL malicious detection.
    """
    
    def __init__(self, model_type: str = 'random_forest'):
        """
        Initialize the URL classifier.
        
        Args:
            model_type: Type of model to use ('random_forest' or 'logistic_regression')
        """
        self.model_type = model_type
        self.model = None
        self.is_trained = False
        
        if model_type == 'random_forest':
            self.model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
        elif model_type == 'logistic_regression':
            self.model = LogisticRegression(random_state=42, max_iter=1000)
        else:
            raise ValueError(f"Unknown model type: {model_type}")
    
    def _features_to_array(self, features: dict) -> np.ndarray:
        """
        Convert feature dictionary to numpy array for model input.
        
        Args:
            features: Dictionary of extracted features
            
        Returns:
            Numpy array of feature values
        """
        return np.array([
            features['url_length'],
            features['dot_count'],
            features['hyphen_count'],
            features['special_char_count'],
            int(features['has_ip']),
            features['suspicious_keyword_count'],
            int(features['has_https']),
            features['subdomain_count'],
            int(features['has_shortening_service'])
        ]).reshape(1, -1)
    
    def train(self, urls: list, labels: list, test_size: float = 0.2):
        """
        Train the model on a dataset of URLs and labels.
        
        Args:
            urls: List of URL strings
            labels: List of labels (0 for benign, 1 for malicious)
            test_size: Proportion of data to use for testing
            
        Returns:
            Tuple of (train_accuracy, test_accuracy)
        """
        # Extract features for all URLs
        X = []
        for url in urls:
            features = extract_all_features(url)
            X.append(self._features_to_array(features)[0])
        
        X = np.array(X)
        y = np.array(labels)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=y
        )
        
        # Train model
        self.model.fit(X_train, y_train)
        self.is_trained = True
        
        # Evaluate
        train_pred = self.model.predict(X_train)
        test_pred = self.model.predict(X_test)
        
        train_acc = accuracy_score(y_train, train_pred)
        test_acc = accuracy_score(y_test, test_pred)
        
        print(f"Training Accuracy: {train_acc:.4f}")
        print(f"Test Accuracy: {test_acc:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, test_pred, target_names=['Benign', 'Malicious']))
        
        return train_acc, test_acc
    
    def predict(self, url: str) -> Tuple[float, int]:
        """
        Predict if a URL is malicious.
        
        Args:
            url: URL string to classify
            
        Returns:
            Tuple of (probability, prediction)
            - probability: Probability of being malicious (0-1)
            - prediction: 0 for benign, 1 for malicious
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        features = extract_all_features(url)
        X = self._features_to_array(features)
        
        # Get prediction and probability
        prediction = self.model.predict(X)[0]
        probability = self.model.predict_proba(X)[0][1]  # Probability of malicious class
        
        return probability, prediction
    
    def save(self, filepath: str):
        """
        Save the trained model to a file.
        
        Args:
            filepath: Path to save the model
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before saving")
        
        with open(filepath, 'wb') as f:
            pickle.dump(self.model, f)
        print(f"Model saved to {filepath}")
    
    def load(self, filepath: str):
        """
        Load a trained model from a file.
        
        Args:
            filepath: Path to load the model from
        """
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found: {filepath}")
        
        with open(filepath, 'rb') as f:
            self.model = pickle.load(f)
        self.is_trained = True
        print(f"Model loaded from {filepath}")


def create_sample_dataset() -> Tuple[list, list]:
    """
    Create a sample dataset for training (for demonstration purposes).
    In production, use a real dataset of malicious and benign URLs.
    
    Returns:
        Tuple of (urls, labels)
    """
    # Sample benign URLs
    benign_urls = [
        "https://www.google.com",
        "https://github.com/user/repo",
        "https://stackoverflow.com/questions/123",
        "https://www.wikipedia.org/wiki/Main_Page",
        "https://www.reddit.com/r/programming",
        "https://news.ycombinator.com",
        "https://www.microsoft.com/en-us",
        "https://www.apple.com",
        "https://www.amazon.com/product/123",
        "https://www.youtube.com/watch?v=abc123",
        "https://twitter.com/user/status/123",
        "https://www.linkedin.com/in/user",
        "https://medium.com/@user/article",
        "https://www.nytimes.com/article",
        "https://www.bbc.com/news"
    ]
    
    # Sample malicious URLs (suspicious patterns)
    malicious_urls = [
        "http://192.168.1.1/login/verify/account",
        "https://free-prize-winner.click/claim-now",
        "http://suspicious-site.com.bad-domain.net/update",
        "https://bank-security-verify.secure-login.com",
        "http://123.45.67.89/download/virus.exe",
        "https://account-suspended-urgent.verify-now.com",
        "http://www.fake-bank.com/login/secure",
        "https://limited-offer.click-now.com/prize",
        "http://malware-download.site.com/install",
        "https://verify-account-now.suspicious-domain.com",
        "http://www.bank-update.com/confirm/urgent",
        "https://free-gift-winner.notify-me.com",
        "http://123.45.67.89/account/validate",
        "https://secure-bank-login.verify-account.com",
        "http://suspicious-keyword-phishing.malware.net"
    ]
    
    urls = benign_urls + malicious_urls
    labels = [0] * len(benign_urls) + [1] * len(malicious_urls)
    
    return urls, labels
