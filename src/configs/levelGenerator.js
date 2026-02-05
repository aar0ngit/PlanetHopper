
function generateObstacleData() {
    const planets = [
        { id: 1, name: 'Terra', speed: 300, duration: 30 },
        { id: 2, name: 'Frost', speed: 400, duration: 30 },
        { id: 3, name: 'Magma', speed: 500, duration: 30 },
        { id: 4, name: 'Cyber', speed: 600, duration: 30 },
        { id: 5, name: 'Void', speed: 1000, duration: 30 }
    ];

    let obstacleValues = [];

    planets.forEach(p => {
        let currentX = 800;
        const maxDistance = p.speed * p.duration;

        let lastType = null;
        let typeCount = 0;

        while (currentX < maxDistance - 1500) {
            let type;

            // prevent more than 2 of the same type in a row
            if (typeCount >= 2) {
                type = lastType === 'low' ? 'high' : 'low';
            } else {
                type = Math.random() > 0.5 ? 'low' : 'high';
            }

            if (type === lastType) {
                typeCount++;
            } else {
                lastType = type;
                typeCount = 1;
            }

            // random spacing between 160 and 230
            const spacing = Math.floor(Math.random() * (230 - 160 + 1)) + 160;
            obstacleValues.push(`(${p.id}, '${type}', ${currentX})`);
            currentX += spacing;
        }
    });

    return obstacleValues;
}

module.exports = { generateObstacleData };
