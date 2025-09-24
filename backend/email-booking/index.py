import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: Send booking confirmation email to specialist
    Args: event - dict with httpMethod, body containing booking details
          context - object with request_id for tracking
    Returns: HTTP response with success/error status
    """
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Parse request data
        body_data = json.loads(event.get('body', '{}'))
        
        # Extract booking details
        service = body_data.get('service')
        date = body_data.get('date')
        time = body_data.get('time')
        client_name = body_data.get('clientName', 'Не указано')
        client_phone = body_data.get('clientPhone', 'Не указано')
        client_email = body_data.get('clientEmail', 'Не указано')
        message = body_data.get('message', '')
        
        if not all([service, date, time]):
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Не указаны обязательные поля: услуга, дата, время'})
            }
        
        # Get email credentials from environment
        smtp_email = os.environ.get('SMTP_EMAIL')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        
        if not smtp_email or not smtp_password:
            return {
                'statusCode': 500,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Email настройки не сконфигурированы'})
            }
        
        # Create email message
        msg = MIMEMultipart()
        msg['From'] = smtp_email
        msg['To'] = smtp_email  # Send to same email (specialist)
        msg['Subject'] = f"Новая запись на консультацию - {service}"
        
        # Create email body
        email_body = f"""
Поступила новая заявка на консультацию!

ДЕТАЛИ ЗАПИСИ:
Услуга: {service}
Дата: {date}
Время: {time}

КОНТАКТЫ КЛИЕНТА:
Имя: {client_name}
Телефон: {client_phone}
Email: {client_email}

Дополнительное сообщение:
{message if message else 'Отсутствует'}

---
Дата заявки: {datetime.now().strftime('%d.%m.%Y %H:%M')}
ID запроса: {context.request_id}
        """
        
        msg.attach(MIMEText(email_body, 'plain', 'utf-8'))
        
        # Send email using Gmail SMTP
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(smtp_email, smtp_password)
            text = msg.as_string()
            server.sendmail(smtp_email, smtp_email, text)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'message': 'Заявка успешно отправлена',
                'requestId': context.request_id
            })
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Некорректный JSON в запросе'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'error': f'Ошибка отправки email: {str(e)}',
                'requestId': context.request_id
            })
        }