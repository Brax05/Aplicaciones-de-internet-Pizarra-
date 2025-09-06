// Variables globales
let canvas, ctx;
let isDrawing = false;
let currentColor = '#000000';
let isEraser = false;
let lastX = 0;
let lastY = 0;

// Referencias a elementos del DOM
const colorOptions = document.querySelectorAll('.color-option');
const eraserButton = document.getElementById('eraser');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeCanvas();
    setupEventListeners();
});

// Inicializar el canvas
function initializeCanvas() {
    canvas = document.getElementById('drawingCanvas');
    ctx = canvas.getContext('2d');
    
    // Configuraciones del contexto
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;
    ctx.strokeStyle = currentColor;
    
    // Fondo blanco
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Configurar event listeners
function setupEventListeners() {
    // Eventos del canvas para dibujar
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Eventos táctiles para dispositivos móviles
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Eventos de la paleta de colores
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectColor(this.dataset.color, this);
        });
    });
    
    // Evento de la goma
    eraserButton.addEventListener('click', function() {
        selectEraser();
    });
    
    // Prevenir el comportamiento por defecto del scroll en dispositivos táctiles
    canvas.addEventListener('touchstart', e => e.preventDefault());
    canvas.addEventListener('touchmove', e => e.preventDefault());
}

// Obtener coordenadas del mouse/touch
function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    
    if (e.touches) {
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
    } else {
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
}

// Comenzar a dibujar
function startDrawing(e) {
    isDrawing = true;
    const coords = getCoordinates(e);
    lastX = coords.x;
    lastY = coords.y;
    
    if (isEraser) {
        // Modo goma - borrar
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(lastX, lastY, 10, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Modo dibujo - dibujar un punto inicial
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = currentColor;
        ctx.fill();
    }
}

// Dibujar
function draw(e) {
    if (!isDrawing) return;
    
    const coords = getCoordinates(e);
    
    if (isEraser) {
        // Modo goma
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(coords.x, coords.y);
        ctx.lineWidth = 20;
        ctx.stroke();
    } else {
        // Modo dibujo
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(coords.x, coords.y);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 5;
        ctx.stroke();
    }
    
    lastX = coords.x;
    lastY = coords.y;
}

// Parar de dibujar
function stopDrawing() {
    isDrawing = false;
}

// Manejar eventos táctiles
function handleTouch(e) {
    e.preventDefault();
    
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                     e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    
    if (e.type === 'touchstart') {
        startDrawing(mouseEvent);
    } else if (e.type === 'touchmove') {
        draw(mouseEvent);
    }
}

// Seleccionar color
function selectColor(color, element) {
    currentColor = color;
    isEraser = false;
    
    // Actualizar estilos visuales
    colorOptions.forEach(opt => opt.classList.remove('active'));
    eraserButton.classList.remove('active');
    element.classList.add('active');
    
    // Cambiar cursor del canvas
    canvas.classList.remove('eraser-mode');
}

// Seleccionar goma
function selectEraser() {
    isEraser = true;
    
    // Actualizar estilos visuales
    colorOptions.forEach(opt => opt.classList.remove('active'));
    eraserButton.classList.add('active');
    
    // Cambiar cursor del canvas
    canvas.classList.add('eraser-mode');
}

