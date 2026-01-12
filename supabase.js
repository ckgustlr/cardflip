// Supabase Configuration
const SUPABASE_URL = 'https://lhkblmmhdnqmdmgpjfyr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxoa2JsbW1oZG5xbWRtZ3BqZnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMDczMjMsImV4cCI6MjA4Mzc4MzMyM30.AFblCKRriqy1bpewb0qou8dKBh_gc-Y8BNobKxnYCsg';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('Supabase client initialized:', supabase ? 'Success' : 'Failed');

// Save score to database
async function saveScore(playerName, moves, timeSeconds, score) {
    console.log('saveScore called with:', { playerName, moves, timeSeconds, score });
    
    try {
        const { data, error } = await supabase
            .from('scores')
            .insert([
                {
                    player_name: playerName,
                    moves: moves,
                    time_seconds: timeSeconds,
                    score: score
                }
            ])
            .select();

        if (error) {
            console.error('Error saving score:', error);
            alert(`점수 저장 실패: ${error.message}`);
            throw error;
        }

        console.log('Score saved successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Failed to save score:', error);
        return { success: false, error: error.message };
    }
}

// Get leaderboard (top 10 scores)
async function getLeaderboard(limit = 10) {
    try {
        const { data, error } = await supabase
            .from('scores')
            .select('*')
            .order('score', { ascending: false })
            .order('completed_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching leaderboard:', error);
            throw error;
        }

        return { success: true, data };
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        return { success: false, error: error.message };
    }
}

// Format time for display (seconds to MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Calculate star rating based on moves
function getStarRating(moves) {
    if (moves <= 12) return '★★★';
    if (moves <= 18) return '★★☆';
    if (moves <= 24) return '★☆☆';
    return '☆☆☆';
}

// Display leaderboard
async function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '<p class="loading">리더보드를 불러오는 중...</p>';

    const result = await getLeaderboard(10);

    if (!result.success) {
        leaderboardList.innerHTML = '<p class="error">리더보드를 불러오는데 실패했습니다.</p>';
        return;
    }

    if (result.data.length === 0) {
        leaderboardList.innerHTML = '<p class="loading">아직 기록이 없습니다. 첫 번째 플레이어가 되어보세요!</p>';
        return;
    }

    leaderboardList.innerHTML = result.data.map((entry, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? 'top-3' : '';
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
        
        return `
            <div class="leaderboard-item">
                <div class="leaderboard-rank ${rankClass}">${medal}</div>
                <div class="leaderboard-name">${entry.player_name}</div>
                <div class="leaderboard-moves">${entry.moves}회</div>
                <div class="leaderboard-score">${entry.score}점</div>
            </div>
        `;
    }).join('');
}

// Initialize leaderboard on page load
document.addEventListener('DOMContentLoaded', () => {
    displayLeaderboard();

    // Refresh leaderboard button
    const refreshBtn = document.getElementById('refreshLeaderboard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', displayLeaderboard);
    }
});
