"""
Heuristic Scoring System

Rule-based scoring system that assigns risk scores to URLs based on
extracted features. Higher scores indicate higher risk.
"""

from typing import List
from .features import extract_all_features


def calculate_heuristic_score(url: str) -> tuple[int, List[str]]:
    """
    Calculate heuristic risk score for a URL based on various features.
    
    Args:
        url: The URL string to analyze
        
    Returns:
        Tuple of (risk_score: int, reasons: List[str])
        - risk_score: Integer from 0-100 indicating risk level
        - reasons: List of strings explaining why the URL is risky
    """
    features = extract_all_features(url)
    risk_score = 0
    reasons = []
    
    # URL Length Analysis (very long URLs are suspicious)
    if features['url_length'] > 200:
        risk_score += 15
        reasons.append(f"Very long URL ({features['url_length']} characters)")
    elif features['url_length'] > 100:
        risk_score += 8
        reasons.append(f"Long URL ({features['url_length']} characters)")
    
    # Excessive dots (subdomain obfuscation)
    if features['dot_count'] > 5:
        risk_score += 20
        reasons.append(f"Excessive dots ({features['dot_count']}) - possible subdomain obfuscation")
    elif features['dot_count'] > 3:
        risk_score += 10
        reasons.append(f"Multiple dots ({features['dot_count']})")
    
    # Excessive hyphens
    if features['hyphen_count'] > 5:
        risk_score += 15
        reasons.append(f"Excessive hyphens ({features['hyphen_count']})")
    elif features['hyphen_count'] > 3:
        risk_score += 7
        reasons.append(f"Multiple hyphens ({features['hyphen_count']})")
    
    # Special characters (often used in obfuscation)
    if features['special_char_count'] > 10:
        risk_score += 20
        reasons.append(f"Many special characters ({features['special_char_count']})")
    elif features['special_char_count'] > 5:
        risk_score += 10
        reasons.append(f"Special characters present ({features['special_char_count']})")
    
    # IP address instead of domain (highly suspicious)
    if features['has_ip']:
        risk_score += 25
        reasons.append("URL contains IP address instead of domain name")
    
    # Suspicious keywords (phishing indicators)
    if features['suspicious_keyword_count'] >= 3:
        risk_score += 25
        reasons.append(f"Multiple suspicious keywords ({features['suspicious_keyword_count']})")
    elif features['suspicious_keyword_count'] == 2:
        risk_score += 15
        reasons.append(f"Suspicious keywords detected ({features['suspicious_keyword_count']})")
    elif features['suspicious_keyword_count'] == 1:
        risk_score += 8
        reasons.append("Suspicious keyword detected")
    
    # Missing HTTPS (security risk)
    if not features['has_https']:
        risk_score += 15
        reasons.append("URL does not use HTTPS encryption")
    
    # Excessive subdomains
    if features['subdomain_count'] > 3:
        risk_score += 15
        reasons.append(f"Excessive subdomains ({features['subdomain_count']})")
    elif features['subdomain_count'] > 1:
        risk_score += 7
        reasons.append(f"Multiple subdomains ({features['subdomain_count']})")
    
    # URL shortening service (can hide destination)
    if features['has_shortening_service']:
        risk_score += 10
        reasons.append("URL uses a shortening service")
    
    # Cap the score at 100
    risk_score = min(risk_score, 100)
    
    # If no reasons found, add a safe indicator
    if not reasons:
        reasons.append("No suspicious patterns detected")
    
    return risk_score, reasons


def get_verdict(risk_score: int) -> str:
    """
    Convert risk score to a human-readable verdict.
    
    Args:
        risk_score: Integer risk score from 0-100
        
    Returns:
        Verdict string: "safe", "suspicious", or "malicious"
    """
    if risk_score < 30:
        return "safe"
    elif risk_score < 70:
        return "suspicious"
    else:
        return "malicious"
