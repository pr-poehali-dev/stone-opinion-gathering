import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для работы с системой голосования партии
    GET / - получить все опросы с вариантами
    POST /vote - проголосовать (body: {"poll_id": 1, "option_id": 2})
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute('''
                SELECT p.id, p.question, p.end_date, p.total_votes,
                       po.id as option_id, po.option_text, po.votes
                FROM polls p
                LEFT JOIN poll_options po ON p.id = po.poll_id
                ORDER BY p.id, po.id
            ''')
            
            rows = cur.fetchall()
            polls_dict = {}
            
            for row in rows:
                poll_id = row[0]
                if poll_id not in polls_dict:
                    polls_dict[poll_id] = {
                        'id': poll_id,
                        'question': row[1],
                        'endDate': row[2].strftime('%Y-%m-%d'),
                        'totalVotes': row[3],
                        'options': []
                    }
                
                if row[4] is not None:
                    polls_dict[poll_id]['options'].append({
                        'id': row[4],
                        'text': row[5],
                        'votes': row[6]
                    })
            
            polls = list(polls_dict.values())
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'polls': polls}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            poll_id = body_data.get('poll_id')
            option_id = body_data.get('option_id')
            
            if not poll_id or not option_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'poll_id and option_id required'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                UPDATE poll_options 
                SET votes = votes + 1 
                WHERE id = %s AND poll_id = %s
            ''', (option_id, poll_id))
            
            cur.execute('''
                UPDATE polls 
                SET total_votes = total_votes + 1 
                WHERE id = %s
            ''', (poll_id,))
            
            conn.commit()
            
            cur.execute('''
                SELECT id, option_text, votes 
                FROM poll_options 
                WHERE poll_id = %s 
                ORDER BY id
            ''', (poll_id,))
            
            options = []
            for row in cur.fetchall():
                options.append({
                    'id': row[0],
                    'text': row[1],
                    'votes': row[2]
                })
            
            cur.execute('SELECT total_votes FROM polls WHERE id = %s', (poll_id,))
            total_votes = cur.fetchone()[0]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'options': options,
                    'totalVotes': total_votes
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()
