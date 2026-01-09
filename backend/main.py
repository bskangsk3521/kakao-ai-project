from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # 통행증 도구 가져오기
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# 🍎 CORS 설정 (프론트엔드 접속 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 모든 곳에서 오는 요청을 허용 (테스트용)
    allow_credentials=True,
    allow_methods=["*"], # GET, POST 등 모든 방식 허용
    allow_headers=["*"], # 모든 헤더 허용
)

if api_key:
    llm = ChatOpenAI(api_key=api_key, model="gpt-4o-mini")
    print(f"✅ 키 로드 성공: {api_key[:10]}...")
else:
    llm = None
    print("❌ 키 로드 실패")

@app.get("/")
def home():
    return {"status": "서버 가동 중"}

@app.get("/chat")
async def chat(user_input: str):
    if not llm: return {"error": "API 키 없음"}
    # 비동기 처리를 위해 await 사용 (권장)
    response = await llm.ainvoke(user_input) 
    return {"ai_answer": response.content}