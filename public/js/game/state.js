// central game state
export const state = {
    token: null,
    sessionId: null,
    planet: null,
    obstacles: [],
    loadout: [],

    isRunning: false,
    isGameOver: false,
    startTime: 0,
    timeElapsed: 0,
    distanceTraveled: 0,
    lastFrameTime: 0,

    // physics settings
    totalFrames: 0,
    speed: 300,
    gravity: 1500,
    groundY: 850,

    // player and enemy properties
    player: {
        x: 400,
        y: 850,
        velocityY: 0,
        width: 40,
        height: 60,
        state: 'running',
        color: '#0d6efd'
    },

    enemy: {
        distance: 100,
        color: '#dc3545'
    },

    // game effects and stats
    shieldActive: false,
    nitroActive: false,
    nitroPaused: false,
    invincible: false,
    hitsTaken: 0,
    isSlamming: false,

    background: null,
    backgroundMusic: null,

    // dom elements
    elements: {
        canvas: null,
        ctx: null,
        timeDisplay: null,
        dangerWarning: null,
        startMessage: null
    }
};
