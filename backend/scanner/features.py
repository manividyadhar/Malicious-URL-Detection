"""
URL Feature Extraction Module

Extracts various features from URLs for malicious detection:
- URL length, structure analysis
- Character patterns (dots, hyphens, special chars)
- IP address detection
- Suspicious keyword detection
- Protocol analysis (HTTPS)
"""

import re
from urllib.parse import urlparse, parse_qs
from ipaddress import ip_address, AddressValueError


def extract_url_length(url: str) -> int:
    """
    Extract the total length of the URL.
    
    Args:
        url: The URL string to analyze
        
    Returns:
        Length of the URL
    """
    return len(url)


def count_dots(url: str) -> int:
    """
    Count the number of dots in the URL.
    Excessive dots may indicate subdomain obfuscation.
    
    Args:
        url: The URL string to analyze
        
    Returns:
        Number of dots in the URL
    """
    return url.count('.')


def count_hyphens(url: str) -> int:
    """
    Count the number of hyphens in the URL.
    Excessive hyphens may indicate suspicious patterns.
    
    Args:
        url: The URL string to analyze
        
    Returns:
        Number of hyphens in the URL
    """
    return url.count('-')


def count_special_chars(url: str) -> int:
    """
    Count special characters in the URL (excluding common URL chars).
    
    Args:
        url: The URL string to analyze
        
    Returns:
        Number of special characters
    """
    # Common URL characters: alphanumeric, :, /, ?, =, &, -, ., _, ~
    special_chars = re.findall(r'[^a-zA-Z0-9:/?=&.\-_~]', url)
    return len(special_chars)


def has_ip_address(url: str) -> bool:
    """
    Check if URL contains an IP address instead of a domain name.
    Malicious sites often use IP addresses to avoid domain reputation checks.
    
    Args:
        url: The URL string to analyze
        
    Returns:
        True if URL contains an IP address, False otherwise
    """
    try:
        parsed = urlparse(url)
        hostname = parsed.hostname or parsed.netloc.split(':')[0]
        
        # Try to parse as IP address
        ip_address(hostname)
        return True
    except (ValueError, AddressValueError, AttributeError):
        # Check if IP is embedded in the URL string
        ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
        if re.search(ip_pattern, url):
            return True
        return False


def count_suspicious_keywords(url: str) -> int:
    """
    Count suspicious keywords in the URL that are commonly used in phishing.
    
    Args:
        url: The URL string to analyze (case-insensitive)
        
    Returns:
        Number of suspicious keywords found
    """
    suspicious_keywords = [
        'login', 'verify', 'update', 'secure', 'bank', 'free',
        'account', 'confirm', 'validate', 'activate', 'suspended',
        'urgent', 'click', 'limited', 'offer', 'prize', 'winner',
        'phishing', 'malware', 'virus', 'download', 'install'
    ]
    
    url_lower = url.lower()
    count = 0
    for keyword in suspicious_keywords:
        if keyword in url_lower:
            count += 1
    
    return count


def has_https(url: str) -> bool:
    """
    Check if URL uses HTTPS protocol.
    
    Args:
        url: The URL string to analyze
        
    Returns:
        True if URL uses HTTPS, False otherwise
    """
    return url.lower().startswith('https://')


def count_subdomains(url: str) -> int:
    """
    Count the number of subdomains in the URL.
    Excessive subdomains may indicate obfuscation attempts.
    
    Args:
        url: The URL string to analyze
        
    Returns:
        Number of subdomains
    """
    try:
        parsed = urlparse(url)
        hostname = parsed.hostname or parsed.netloc.split(':')[0]
        if not hostname:
            return 0
        
        parts = hostname.split('.')
        # Remove TLD and domain, count remaining parts as subdomains
        if len(parts) > 2:
            return len(parts) - 2
        return 0
    except (AttributeError, ValueError):
        return 0


def has_shortening_service(url: str) -> bool:
    """
    Check if URL uses a URL shortening service.
    Shortened URLs can hide the actual destination.
    
    Args:
        url: The URL string to analyze
        
    Returns:
        True if URL appears to be from a shortening service
    """
    shortening_domains = [
        'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly',
        'is.gd', 'short.link', 'rebrand.ly', 'cutt.ly'
    ]
    
    try:
        parsed = urlparse(url)
        hostname = parsed.hostname or parsed.netloc.split(':')[0]
        if not hostname:
            return False
        
        hostname_lower = hostname.lower()
        for domain in shortening_domains:
            if domain in hostname_lower:
                return True
        return False
    except (AttributeError, ValueError):
        return False


def extract_all_features(url: str) -> dict:
    """
    Extract all features from a URL for analysis.
    
    Args:
        url: The URL string to analyze
        
    Returns:
        Dictionary containing all extracted features
    """
    return {
        'url_length': extract_url_length(url),
        'dot_count': count_dots(url),
        'hyphen_count': count_hyphens(url),
        'special_char_count': count_special_chars(url),
        'has_ip': has_ip_address(url),
        'suspicious_keyword_count': count_suspicious_keywords(url),
        'has_https': has_https(url),
        'subdomain_count': count_subdomains(url),
        'has_shortening_service': has_shortening_service(url)
    }
