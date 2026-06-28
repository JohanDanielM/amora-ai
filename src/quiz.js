// Quiz page JavaScript
console.log('Quiz page loaded!');

document.addEventListener('DOMContentLoaded', () => {
    const questions = document.querySelectorAll('.question-box');
    const answers = {};
    let currentQuestion = 1;

    // Initialize progress bar
    updateProgressBar(1);

    function updateProgressBar(step) {
        const progressBar = document.getElementById('quizProgressBar');
        const progressText = document.getElementById('quizProgressText');
        if (progressBar && progressText) {
            const percentage = (step / 5) * 100;
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${step} / 5`;
        }
    }

    // Handle option button clicks
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const questionNum = parseInt(this.dataset.question);
            const value = this.dataset.value;
            
            // Store answer
            answers[questionNum] = value;
            
            // Mark button as selected
            const questionBox = document.getElementById(`question${questionNum}`);
            questionBox.querySelectorAll('.option-btn').forEach(b => {
                b.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Scroll to next question after a short delay
            if (questionNum < 5) {
                setTimeout(() => {
                    scrollToNextQuestion(questionNum + 1);
                }, 500);
            } else {
                // Last question - show completion
                setTimeout(() => {
                    showCompletion();
                }, 500);
            }
        });
    });

    function scrollToNextQuestion(nextQuestionNum) {
        const currentBox = document.getElementById(`question${currentQuestion}`);
        const nextBox = document.getElementById(`question${nextQuestionNum}`);
        
        if (nextBox) {
            // Remove active class from current
            currentBox.classList.remove('active');
            currentBox.classList.add('answered');
            
            // Add active class to next
            nextBox.classList.add('active');
            
            // Smooth scroll to next question
            nextBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            currentQuestion = nextQuestionNum;
            updateProgressBar(currentQuestion);
        }
    }

    function showCompletion() {
        const lastBox = document.getElementById('question5');
        lastBox.classList.remove('active');
        lastBox.classList.add('answered');
        
        // Final progress bar update to 5/5
        updateProgressBar(5);
        
        const completionBox = document.getElementById('completionBox');
        completionBox.classList.add('active');
        completionBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Log all answers
        console.log('Quiz answers:', answers);
        
        // Store answers in localStorage as amoraPreferences
        const preferences = {
            stateOfMind: answers[1] || 'calm',
            interactionType: answers[2] || 'text',
            responseStyle: answers[3] || 'short',
            wantsTTS: answers[4] === 'yes',
            interfaceStyle: answers[5] || 'calm'
        };
        localStorage.setItem('amoraPreferences', JSON.stringify(preferences));
        
        // Redirect to login page with fromQuiz query parameter after showing completion message
        setTimeout(() => {
            window.location.href = 'login.html?fromQuiz=true';
        }, 2000);
    }

    // Handle quiz image loading error
    document.querySelectorAll('.quiz-image').forEach(img => {
        img.addEventListener('error', function() {
            console.log('Quiz image not found. Please add quiz.jpg to the project root.');
            this.style.display = 'none';
        });
    });
});
