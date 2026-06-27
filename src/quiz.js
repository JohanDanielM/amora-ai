// Quiz page JavaScript
console.log('Quiz page loaded!');

document.addEventListener('DOMContentLoaded', () => {
    const questions = document.querySelectorAll('.question-box');
    const answers = {};
    let currentQuestion = 1;

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
        }
    }

    function showCompletion() {
        const lastBox = document.getElementById('question5');
        lastBox.classList.remove('active');
        lastBox.classList.add('answered');
        
        const completionBox = document.getElementById('completionBox');
        completionBox.classList.add('active');
        completionBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Log all answers
        console.log('Quiz answers:', answers);
        
        // Store answers in localStorage (optional, for later use)
        localStorage.setItem('quizAnswers', JSON.stringify(answers));
        
        // Redirect to login page after showing completion message
        setTimeout(() => {
            window.location.href = 'login.html';
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

