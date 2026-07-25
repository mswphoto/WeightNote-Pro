const historyDiv = document.getElementById("history");
const volumeSpan = document.getElementById("volume");
const setsSpan = document.getElementById("sets");
const prDiv = document.getElementById("pr");

let workouts = JSON.parse(localStorage.getItem("workouts")) || [];

function save() {
    localStorage.setItem("workouts", JSON.stringify(workouts));
}

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

        if (w.weight > pr) pr = w.weight;

        historyDiv.innerHTML += `
        <div>
        ${w.exercise}
        ${w.weight}kg × ${w.reps}
        <button onclick="removeWorkout(${index})">삭제</button>
        </div>
        `;
    });

    volumeSpan.textContent = volume;
    setsSpan.textContent = workouts.length;
    prDiv.textContent = pr + " kg";
}

function removeWorkout(index){
    workouts.splice(index,1);
    save();
    render();
}

document.getElementById("startBtn").onclick=function(){

    const exercise=document.getElementById("exercise").value;

    let weight=prompt("무게(kg)");

    if(weight===null) return;

    let reps=prompt("횟수");

    if(reps===null) return;

    workouts.push({
        exercise,
        weight:Number(weight),
        reps:Number(reps)
    });

    save();
    render();
};

let timer;

function startTimer(sec){

    clearInterval(timer);

    let remain=sec;

    document.getElementById("timerText").textContent=
    remain+"초";

    timer=setInterval(()=>{

        remain--;

        document.getElementById("timerText").textContent=
        remain+"초";

        if(remain<=0){

            clearInterval(timer);

            document.getElementById("timerText").textContent=
            "휴식 종료!";
        }

    },1000);

}

document.getElementById("timer60").onclick=()=>startTimer(60);
document.getElementById("timer90").onclick=()=>startTimer(90);
document.getElementById("timer120").onclick=()=>startTimer(120);

render();
const searchExercise = document.getElementById("searchExercise");
const exerciseSelect = document.getElementById("exercise");

const exerciseList = [
    "벤치프레스",
    "랫풀다운",
    "스쿼트",
    "숄더프레스"
];

searchExercise.addEventListener("input", function () {

    const keyword = searchExercise.value.trim().toLowerCase();

    exerciseSelect.innerHTML = "";

    const filtered = exerciseList.filter(exercise =>
        exercise.toLowerCase().includes(keyword)
    );

    filtered.forEach(exercise => {
        const option = document.createElement("option");
        option.value = exercise;
        option.textContent = exercise;
        exerciseSelect.appendChild(option);
    });

});
