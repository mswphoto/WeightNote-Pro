const historyDiv = document.getElementById("history");
const volumeSpan = document.getElementById("volume");
const setsSpan = document.getElementById("sets");
const prDiv = document.getElementById("pr");

const searchExercise = document.getElementById("searchExercise");
const exerciseSelect = document.getElementById("exercise");
const categorySelect = document.getElementById("category");

let workouts = JSON.parse(localStorage.getItem("workouts")) || [];


// 운동 부위별 종목

const exercisesByCategory = {

    "가슴": [
        "벤치프레스",
        "인클라인 벤치프레스",
        "체스트프레스",
        "펙덱 플라이",
        "케이블 크로스오버"
    ],

    "등": [
        "랫풀다운",
        "시티드 로우",
        "케이블 로우",
        "바벨 로우",
        "덤벨 로우",
        "풀업"
    ],

    "하체": [
        "스쿼트",
        "레그프레스",
        "레그 익스텐션",
        "레그 컬",
        "루마니안 데드리프트",
        "힙 어브덕션",
        "힙 어덕션",
        "카프 레이즈"
    ],

    "어깨": [
        "숄더프레스",
        "덤벨 숄더프레스",
        "사이드 레터럴 레이즈",
        "프론트 레이즈",
        "리어 델트 플라이"
    ],

    "팔": [
        "바벨 컬",
        "덤벨 컬",
        "해머 컬",
        "케이블 컬",
        "트라이셉스 푸시다운",
        "오버헤드 트라이셉스 익스텐션"
    ],

    "복근": [
        "크런치",
        "레그레이즈",
        "케이블 크런치",
        "플랭크"
    ],

    "유산소": [
        "트레드밀",
        "사이클",
        "스텝밀",
        "일립티컬"
    ]
};


// 저장

function save() {
    localStorage.setItem("workouts", JSON.stringify(workouts));
}


// 기록 화면 표시

function render() {

    historyDiv.innerHTML = "";

    if (workouts.length === 0) {

        historyDiv.innerHTML = "아직 기록이 없습니다.";
        volumeSpan.textContent = 0;
        setsSpan.textContent = 0;
        prDiv.textContent = "아직 기록이 없습니다.";

        return;
    }

    let volume = 0;
    let pr = 0;

    workouts.forEach((w, index) => {

        volume += w.weight * w.reps;

        if (w.weight > pr) {
            pr = w.weight;
        }

        historyDiv.innerHTML += `
            <div>
                ${w.exercise}
                ${w.weight}kg × ${w.reps}
                <button onclick="removeWorkout(${index})">
                    삭제
                </button>
            </div>
        `;
    });

    volumeSpan.textContent = volume;
    setsSpan.textContent = workouts.length;
    prDiv.textContent = pr + " kg";
}


// 기록 삭제

function removeWorkout(index) {

    workouts.splice(index, 1);

    save();
    render();
}


// 운동 추가

document.getElementById("startBtn").onclick = function () {

    const exercise = exerciseSelect.value;

    if (!exercise) {
        alert("운동을 선택해주세요.");
        return;
    }

    const weightInput = prompt("무게(kg)");

    if (weightInput === null) return;

    const weight = Number(weightInput);

    if (
        weightInput.trim() === "" ||
        !Number.isFinite(weight) ||
        weight < 0
    ) {
        alert("무게를 숫자로 입력해주세요.");
        return;
    }

    const repsInput = prompt("횟수");

    if (repsInput === null) return;

    const reps = Number(repsInput);

    if (
        repsInput.trim() === "" ||
        !Number.isInteger(reps) ||
        reps <= 0
    ) {
        alert("횟수를 1 이상의 정수로 입력해주세요.");
        return;
    }

    workouts.push({
        exercise: exercise,
        weight: weight,
        reps: reps,
        date: new Date().toISOString()
    });

    save();
    render();
};


// 휴식 타이머

let timer;

function startTimer(sec) {

    clearInterval(timer);

    let remain = sec;

    document.getElementById("timerText").textContent =
        remain + "초";

    timer = setInterval(() => {

        remain--;

        document.getElementById("timerText").textContent =
            remain + "초";

        if (remain <= 0) {

            clearInterval(timer);

            document.getElementById("timerText").textContent =
                "휴식 종료!";
        }

    }, 1000);
}


document.getElementById("timer60").onclick =
    () => startTimer(60);

document.getElementById("timer90").onclick =
    () => startTimer(90);

document.getElementById("timer120").onclick =
    () => startTimer(120);


// 선택한 부위의 운동 종목 표시

function updateExerciseList() {

    const category = categorySelect.value;

    const keyword =
        searchExercise.value.trim().toLowerCase();

    const list =
        exercisesByCategory[category] || [];

    const filtered = list.filter(exercise =>
        exercise.toLowerCase().includes(keyword)
    );

    exerciseSelect.innerHTML = "";

    filtered.forEach(exercise => {

        const option =
            document.createElement("option");

        option.value = exercise;
        option.textContent = exercise;

        exerciseSelect.appendChild(option);
    });
}


// 운동 부위 변경

categorySelect.addEventListener("change", function () {

    searchExercise.value = "";

    updateExerciseList();
});


// 운동 검색

searchExercise.addEventListener("input", function () {

    updateExerciseList();
});


// 앱 시작

updateExerciseList();
render();
