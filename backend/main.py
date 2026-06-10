from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx, json

app = FastAPI(title='ThinkForge AI')
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])

class GoalRequest(BaseModel):
    goal: str
    user_id: str = 'default'

async def ollama(prompt):
    async with httpx.AsyncClient(timeout=120.0) as c:
        r = await c.post('http://127.0.0.1:11434/api/generate', json={'model':'llama3.1:8b','prompt':prompt,'stream':False})
        return r.json()['response']

@app.get('/api/health')
async def health():
    return {'status':'ok'}

@app.post('/api/analyze')
async def analyze(req: GoalRequest):
    g = req.goal
    steps = []

    steps.append({'step':1,'title':'Goal Analysis','status':'thinking'})
    goal_r = await ollama(f'Analyze this goal: "{g}". List: constraints, timeline, skills needed, success criteria. Be concise.')

    steps.append({'step':2,'title':'Task Breakdown','status':'thinking'})
    tasks_r = await ollama(f'Break this goal into 6 ordered tasks: "{g}". Format: 1. Task - description')

    steps.append({'step':3,'title':'Reasoning','status':'thinking'})
    reason_r = await ollama(f'Think step by step how to achieve: "{g}". Give 5 key insights.')

    steps.append({'step':4,'title':'Planning','status':'thinking'})
    plan_r = await ollama(f'Create a weekly plan for: "{g}". Give week 1-4 focus areas.')

    steps.append({'step':5,'title':'Verification','status':'thinking'})
    verify_r = await ollama(f'Review this goal plan: "{g}". Is it realistic? Rate confidence 0-100 and give 3 suggestions.')

    return {
        'goal': g,
        'status': 'complete',
        'reasoning_steps': [
            {'step':1,'title':'Goal Analysis','result':goal_r},
            {'step':2,'title':'Task Breakdown','result':tasks_r},
            {'step':3,'title':'Reasoning','result':reason_r},
            {'step':4,'title':'Planning','result':plan_r},
            {'step':5,'title':'Verification','result':verify_r},
        ]
    }

