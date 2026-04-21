(function(){

const modal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');
const filmCards = document.querySelectorAll('.film[data-id]');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileBackdrop = document.getElementById('mobileBackdrop');
const contactModal = document.getElementById('contactModal');
const fitModal = document.getElementById('fitModal');
const badFitModal = document.getElementById('badFitModal');
const mobilePreloader = document.getElementById('mobilePreloader');

if(window.innerWidth <= 1000 && mobilePreloader){
window.addEventListener('load', function(){
//setTimeout(function(){
mobilePreloader.classList.add('hidden');
//}, 150);
});
}

function applyBodyLock(){
const isOpen =
(modal && modal.classList.contains('open')) ||
(contactModal && contactModal.classList.contains('open')) ||
(fitModal && fitModal.classList.contains('open')) ||
(badFitModal && badFitModal.classList.contains('open')) ||
(mobileMenu && mobileMenu.classList.contains('open'));
document.body.style.overflow = isOpen ? 'hidden' : '';
}

function openMobileMenu(){
if(!menuToggle || !mobileMenu || !mobileBackdrop) return;
menuToggle.classList.add('active');
menuToggle.setAttribute('aria-expanded', 'true');
mobileMenu.classList.add('open');
mobileMenu.setAttribute('aria-hidden', 'false');
mobileBackdrop.classList.add('open');
applyBodyLock();
}

function closeMobileMenu(){
if(!menuToggle || !mobileMenu || !mobileBackdrop) return;
menuToggle.classList.remove('active');
menuToggle.setAttribute('aria-expanded', 'false');
mobileMenu.classList.remove('open');
mobileMenu.setAttribute('aria-hidden', 'true');
mobileBackdrop.classList.remove('open');
applyBodyLock();
}

window.openContactModal = function(){
if(!contactModal) return;
contactModal.classList.add('open');
contactModal.setAttribute('aria-hidden', 'false');
applyBodyLock();
};

window.closeContactModal = function(){
if(!contactModal) return;
contactModal.classList.remove('open');
contactModal.setAttribute('aria-hidden', 'true');
applyBodyLock();
};

window.openFitModal = function(){
if(!fitModal) return;
fitModal.classList.add('open');
fitModal.setAttribute('aria-hidden', 'false');
if(badFitModal){
badFitModal.classList.remove('open');
badFitModal.setAttribute('aria-hidden', 'true');
}
restartFitAssessment();
applyBodyLock();
};

window.closeFitModal = function(){
if(!fitModal) return;
fitModal.classList.remove('open');
fitModal.setAttribute('aria-hidden', 'true');
applyBodyLock();
};

window.openBadFitModal = function(){
if(!badFitModal) return;
if(fitModal){
fitModal.classList.remove('open');
fitModal.setAttribute('aria-hidden', 'true');
}
badFitModal.classList.add('open');
badFitModal.setAttribute('aria-hidden', 'false');
applyBodyLock();
};

window.closeBadFitModal = function(){
if(!badFitModal) return;
badFitModal.classList.remove('open');
badFitModal.setAttribute('aria-hidden', 'true');
applyBodyLock();
};

if(menuToggle){
menuToggle.addEventListener('click', function(){
if(mobileMenu.classList.contains('open')){
closeMobileMenu();
}else{
openMobileMenu();
}
});
}

if(mobileBackdrop){
mobileBackdrop.addEventListener('click', function(){
closeMobileMenu();
});
}

document.querySelectorAll('.mobile-panel a').forEach(function(link){
link.addEventListener('click', function(){
closeMobileMenu();
});
});

window.openVideo = function(id){
modal.classList.add('open');
videoFrame.src = 'https://player.vimeo.com/video/' + id + '?autoplay=1';
applyBodyLock();
};

window.closeVideo = function(){
modal.classList.remove('open');
videoFrame.src = '';
applyBodyLock();
};

if(modal){
modal.addEventListener('click', function(e){
if(e.target === modal) closeVideo();
});
}

if(contactModal){
contactModal.addEventListener('click', function(e){
if(e.target === contactModal) closeContactModal();
});
}

if(fitModal){
fitModal.addEventListener('click', function(e){
if(e.target === fitModal) closeFitModal();
});
}

if(badFitModal){
badFitModal.addEventListener('click', function(e){
if(e.target === badFitModal) closeBadFitModal();
});
}

document.addEventListener('keydown', function(e){
if(e.key === 'Escape'){
if(modal && modal.classList.contains('open')) closeVideo();
if(contactModal && contactModal.classList.contains('open')) closeContactModal();
if(fitModal && fitModal.classList.contains('open')) closeFitModal();
if(badFitModal && badFitModal.classList.contains('open')) closeBadFitModal();
if(mobileMenu && mobileMenu.classList.contains('open')) closeMobileMenu();
}
});

filmCards.forEach(function(film){
const id = film.dataset.id;
const img = film.querySelector('img');
const title = film.querySelector('.film-title');

film.addEventListener('click', function(){
openVideo(id);
});

film.addEventListener('keydown', function(e){
if(e.key === 'Enter' || e.key === ' '){
e.preventDefault();
openVideo(id);
}
});

fetch('https://vimeo.com/api/v2/video/' + id + '.json')
.then(function(response){ return response.json(); })
.then(function(data){
if(!data || !data[0]) return;
const video = data[0];
const thumb = video.thumbnail_large || video.thumbnail_medium || '';
img.src = thumb;
img.alt = video.title ? video.title + ' wedding film thumbnail' : 'Wedding film thumbnail';
title.textContent = video.title || '';
film.setAttribute('aria-label', video.title ? 'Open ' + video.title : 'Open wedding film');
})
.catch(function(){
img.alt = 'Wedding film thumbnail';
title.textContent = '';
});
});

const revealItems = document.querySelectorAll('.reveal, .reveal-soft, .hero-film-motion, .reveal-process');

if('IntersectionObserver' in window){
const observer = new IntersectionObserver(function(entries){
entries.forEach(function(entry){
if(entry.isIntersecting){
entry.target.classList.add('is-visible');
observer.unobserve(entry.target);
}
});
}, {
threshold: 0.16,
rootMargin: '0px 0px -8% 0px'
});
revealItems.forEach(function(item){ observer.observe(item); });
}else{
revealItems.forEach(function(item){ item.classList.add('is-visible'); });
}

const track = document.getElementById('testimonialsTrack');
const slides = track ? Array.from(track.children) : [];
const prevBtn = document.querySelector('.testimonials-arrow--prev');
const nextBtn = document.querySelector('.testimonials-arrow--next');
const dots = Array.from(document.querySelectorAll('.testimonials-dot'));
let currentSlide = 0;

function updateTestimonials(){
if(!track || !slides.length) return;
track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
dots.forEach(function(dot, index){
dot.classList.toggle('active', index === currentSlide);
});
}

if(prevBtn){
prevBtn.addEventListener('click', function(){
currentSlide = (currentSlide - 1 + slides.length) % slides.length;
updateTestimonials();
});
}

if(nextBtn){
nextBtn.addEventListener('click', function(){
currentSlide = (currentSlide + 1) % slides.length;
updateTestimonials();
});
}

dots.forEach(function(dot, index){
dot.addEventListener('click', function(){
currentSlide = index;
updateTestimonials();
});
});

const viewport = document.querySelector('.testimonials-viewport');
let touchStartX = 0;
let touchEndX = 0;

if(viewport){
viewport.addEventListener('touchstart', function(e){
touchStartX = e.changedTouches[0].clientX;
}, {passive:true});

viewport.addEventListener('touchend', function(e){
touchEndX = e.changedTouches[0].clientX;
const diff = touchStartX - touchEndX;
if(Math.abs(diff) > 40){
if(diff > 0){
currentSlide = (currentSlide + 1) % slides.length;
}else{
currentSlide = (currentSlide - 1 + slides.length) % slides.length;
}
updateTestimonials();
}
}, {passive:true});
}

updateTestimonials();

const filmsTrack = document.getElementById('filmsTrack');
const filmSlides = filmsTrack ? Array.from(filmsTrack.children) : [];
const filmPrev = document.querySelector('.films-arrow--prev');
const filmNext = document.querySelector('.films-arrow--next');
const filmDots = Array.from(document.querySelectorAll('.films-dot'));
const filmsViewport = document.querySelector('.films-viewport');
let currentFilm = 0;

function isMobile(){
return window.innerWidth <= 1000;
}

function updateFilms(){
if(!filmsTrack || !filmSlides.length) return;
if(isMobile()){
filmsTrack.style.transform = 'translateX(-' + (currentFilm * 100) + '%)';
}else{
filmsTrack.style.transform = '';
}
filmDots.forEach(function(dot, index){
dot.classList.toggle('active', index === currentFilm);
});
}

if(filmPrev){
filmPrev.addEventListener('click', function(){
currentFilm = (currentFilm - 1 + filmSlides.length) % filmSlides.length;
updateFilms();
});
}

if(filmNext){
filmNext.addEventListener('click', function(){
currentFilm = (currentFilm + 1) % filmSlides.length;
updateFilms();
});
}

filmDots.forEach(function(dot, index){
dot.addEventListener('click', function(){
currentFilm = index;
updateFilms();
});
});

let filmTouchStartX = 0;
let filmTouchEndX = 0;

if(filmsViewport){
filmsViewport.addEventListener('touchstart', function(e){
filmTouchStartX = e.changedTouches[0].clientX;
}, {passive:true});

filmsViewport.addEventListener('touchend', function(e){
filmTouchEndX = e.changedTouches[0].clientX;
const diff = filmTouchStartX - filmTouchEndX;
if(Math.abs(diff) > 40 && isMobile()){
if(diff > 0){
currentFilm = (currentFilm + 1) % filmSlides.length;
}else{
currentFilm = (currentFilm - 1 + filmSlides.length) % filmSlides.length;
}
updateFilms();
}
}, {passive:true});
}

window.addEventListener('resize', updateFilms);
updateFilms();

/* fit assessment */
const fitQuestions = [
{
question: "When it comes to your wedding film, what feels closest to you?",
options: [
{ text: "I want the wedding film of my dreams: emotional, elegant, and storytelling-driven.", score: 3 },
{ text: "Since it is something I can afford, I am open to either a regular film or something more cinematic.", score: 1 },
{ text: "To be honest, I was not even planning on having a videographer. Photos matter more to me.", score: 0 }
]
},
{
question: "What kind of film matters most to you?",
options: [
{ text: "Any kind of video works for me, even trendy content-creator or TikTok-style clips.", score: 0 },
{ text: "I mostly just want someone there recording the day.", score: 1 },
{ text: "I want a professional who understands our story and can turn it into an emotional, intentional wedding film.", score: 3 }
]
},
{
question: "When it comes to creating your film, you are:",
options: [
{ text: "Willing to participate in the process as recommended by the professional.", score: 3 },
{ text: "Open to the final result, but I do not really want much direction.", score: 1 },
{ text: "Not interested in doing anything beyond simply being there.", score: 0 }
]
},
{
question: "A full wedding film experience with high-quality coverage and a professional team can reach $7,000. Which feels closest to you?",
options: [
{ text: "No way.", score: 0 },
{ text: "I am interested, but I am on a tighter budget.", score: 2 },
{ text: "That feels reasonable, and I would like to discuss my plans so you can recommend the right package for my day.", score: 3 }
]
}
];

const fitProgress = document.getElementById('fitProgress');
const fitQuestion = document.getElementById('fitQuestion');
const fitOptions = document.getElementById('fitOptions');
const fitStep = document.getElementById('fitStep');
const fitBackButton = document.getElementById('fitBackButton');
const fitRestartButton = document.getElementById('fitRestartButton');
const fitResultGood = document.getElementById('fitResultGood');
const fitResultMaybe = document.getElementById('fitResultMaybe');
const fitResultNotFit = document.getElementById('fitResultNotFit');

let fitCurrentIndex = 0;
let fitAnswers = [];

function renderFitQuestion(){
if(!fitQuestion || !fitOptions || !fitProgress) return;

fitResultGood.classList.remove('active');
fitResultMaybe.classList.remove('active');
fitResultNotFit.classList.remove('active');
fitStep.style.display = 'block';

const current = fitQuestions[fitCurrentIndex];
fitProgress.textContent = 'Question ' + (fitCurrentIndex + 1) + ' of ' + fitQuestions.length;
fitQuestion.textContent = current.question;
fitOptions.innerHTML = '';

current.options.forEach(function(option){
const btn = document.createElement('button');
btn.type = 'button';
btn.className = 'fit-option';
btn.innerHTML = '<span class="fit-option__text">' + option.text + '</span>';
btn.addEventListener('click', function(){
fitAnswers[fitCurrentIndex] = option.score;
if(fitCurrentIndex < fitQuestions.length - 1){
fitCurrentIndex++;
renderFitQuestion();
}else{
showFitResult();
}
});
fitOptions.appendChild(btn);
});

fitBackButton.style.display = fitCurrentIndex === 0 ? 'none' : 'inline-flex';
}

function showFitResult(){
fitStep.style.display = 'none';
const total = fitAnswers.reduce(function(sum, value){ return sum + value; }, 0);

fitResultGood.classList.remove('active');
fitResultMaybe.classList.remove('active');
fitResultNotFit.classList.remove('active');

if(total >= 10){
fitResultGood.classList.add('active');
}else if(total >= 4){
fitResultMaybe.classList.add('active');
}else{
fitResultNotFit.classList.add('active');
}
}

window.restartFitAssessment = function(){
fitCurrentIndex = 0;
fitAnswers = [];
renderFitQuestion();
};

if(fitBackButton){
fitBackButton.addEventListener('click', function(){
if(fitCurrentIndex > 0){
fitCurrentIndex--;
renderFitQuestion();
}
});
}

if(fitRestartButton){
fitRestartButton.addEventListener('click', function(){
restartFitAssessment();
});
}

renderFitQuestion();

})();
