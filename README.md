# 🐿️ 다람쥐 카드 뒤집기 게임

다람쥐 테마의 메모리 카드 매칭 게임입니다.

## 게임 방법
- 4x4 그리드의 카드를 클릭하여 뒤집습니다
- 같은 이모지를 가진 카드 2장을 찾으세요
- 모든 카드 쌍을 맞추면 게임이 끝납니다

## 점수 시스템
- **점수**: (8 / 시도 횟수) × 1000점
- **별점**: 
  - ★★★ 12회 이하
  - ★★☆ 18회 이하
  - ★☆☆ 24회 이하

## 기술 스택
- HTML5, CSS3, Vanilla JavaScript
- Supabase (데이터베이스 & 인증)

## 설정 방법

### 1. Supabase 설정
```bash
# config.example.js를 config.js로 복사
cp config.example.js config.js

# config.js를 열어서 실제 Supabase 정보로 수정
# - url: Supabase 프로젝트 URL
# - key: Supabase anon/public key
```

### 2. Supabase 키 찾기
1. https://supabase.com 접속
2. 프로젝트 선택
3. Settings → API
4. Project URL과 anon public key 복사

## 로컬에서 실행
```bash
# 웹 서버 실행 (Python)
python -m http.server 8000

# 또는 Node.js
npx http-server
```

브라우저에서 http://localhost:8000 접속

## 배포

### Vercel 배포 방법

1. **GitHub 저장소 연결**
   - Vercel에서 GitHub 저장소 `cardflip` 선택

2. **환경 변수 설정** (필수)
   - Vercel 프로젝트 → Settings → Environment Variables
   - 다음 환경 변수 추가:
     - `SUPABASE_URL`: `https://lhkblmmhdnqmdmgpjfyr.supabase.co`
     - `SUPABASE_ANON_KEY`: Supabase anon/public key
   - Environment: Production, Preview, Development 모두 체크

3. **배포**
   - Deploy 버튼 클릭
   - 빌드 시 자동으로 `config.js`가 생성됩니다

### 다른 호스팅 서비스
Netlify 등에서도 동일한 방법으로 환경 변수를 설정하면 됩니다.

## 보안 주의사항
- `config.js` 파일은 Git에 커밋하지 마세요 (.gitignore에 포함됨)
- anon/public key는 클라이언트에서 사용해도 안전합니다
- Row Level Security (RLS) 정책으로 데이터가 보호됩니다
