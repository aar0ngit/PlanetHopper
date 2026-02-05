// P2509361
// Aaron Tan
// DIT/FT/1B/08

// ERROR HELPERS

// simple error alert
const showErrorModal = function (title, message) {
    alert(title + ": " + message);
};

// FETCH WRAPPER

// core fetch method
const fetchMethod = function (url, callback, method = "GET", data = null, token = null) {
    console.log("fetchMethod: ", url, method, data, token);

    const headers = {};
    if (data && !(data instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }
    if (token) headers["Authorization"] = "Bearer " + token;

    const options = {
        method: method.toUpperCase(),
        headers: headers,
    };

    if (method.toUpperCase() !== "GET" && data !== null) {
        options.body = (data instanceof FormData) ? data : JSON.stringify(data);
    }

    fetch(url, options)
        .then(function (response) {
            if (response.status == 204) {
                callback(response.status, true, {});
            } else {
                response.json().then(function (responseData) {
                    if (!response.ok && responseData?.message === "JWT expired") {
                        document.dispatchEvent(new CustomEvent("auth:expired"));
                        return;
                    }
                    callback(response.status, response.ok, responseData);
                }).catch(function (err) {
                    callback(response.status, response.ok, { message: "Error parsing response" });
                });
            }
        })
        .catch(function (error) {
            console.error(`Error from ${method} ${url}:`, error);
            showErrorModal("Connection Error", "Unable to connect to the server.");
        });
};

// AUTHENTICATION

// user & authentication api
export const loginUser = function (data, callback) {
    fetchMethod('/api/users/login', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Login Failed", resData.message || "Login failed"); callback({ message: resData.message }, null); }
    }, 'POST', data);
};

// register a new user
export const registerUser = function (data, callback) {
    fetchMethod('/api/users/register', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Registration Failed", resData.message || "Registration failed"); callback({ message: resData.message }, null); }
    }, 'POST', data);
};

// fetch current user profile
export const fetchUserProfile = function (token, callback) {
    fetchMethod('/api/users/profile', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Profile Error", resData.message || "Profile error"); callback({ message: resData.message }, null); }
    }, 'GET', null, token);
};

// fetch user points balance
export const fetchUserPoints = function (token, callback) {
    fetchMethod('/api/users/points', function (status, ok, resData) {
        if (ok && resData.points !== undefined) callback(null, resData.points);
        else { showErrorModal("Points Error", resData.message || "Points error"); callback({ message: resData.message }, null); }
    }, 'GET', null, token);
};

// CHALLENGES

// wellness challenges api
export const fetchChallenges = function (callback) {
    fetchMethod('/api/challenges', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Fetch Error", resData.message || "Fetch error"); callback({ message: resData.message }, null); }
    }, 'GET');
};

// create a new challenge
export const createChallenge = function (data, token, callback) {
    fetchMethod('/api/challenges', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Create Error", resData.message || "Create error"); callback({ message: resData.message }, null); }
    }, 'POST', data, token);
};

// delete a challenge
export const deleteChallenge = function (id, token, callback) {
    fetchMethod(`/api/challenges/${id}`, function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Delete Error", resData.message || "Delete error"); callback({ message: resData.message }, null); }
    }, 'DELETE', null, token);
};

// COMPLETIONS

// submit a challenge completion
export const submitCompletion = function (challengeId, data, token, callback) {
    fetchMethod(`/api/completion/${challengeId}`, function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Submit Error", resData.message || "Submit error"); callback({ message: resData.message }, null); }
    }, 'POST', data, token);
};

// fetch completions for a challenge
export const fetchCompletions = function (challengeId, token, callback) {
    fetchMethod(`/api/completion/${challengeId}`, function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Fetch Error", resData.message || "Fetch error"); callback({ message: resData.message }, null); }
    }, 'GET', null, token);
};

// SHOP

// shop & economy api
export const fetchShopItems = function (callback) {
    fetchMethod('/api/shop/items', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Fetch Error", resData.message || "Fetch error"); callback({ message: resData.message }, null); }
    }, 'GET');
};

// purchase a shop item
export const purchaseItem = function (itemId, token, callback) {
    fetchMethod('/api/shop/purchase', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Purchase Failed", resData.message || "Purchase failed"); callback({ message: resData.message }, null); }
    }, 'POST', { item_id: itemId, quantity: 1 }, token);
};

// INVENTORY

// player inventory api
export const fetchInventory = function (userId, token, callback) {
    fetchMethod(`/api/inventory/${userId}`, function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Fetch Error", resData.message || "Fetch error"); callback({ message: resData.message }, null); }
    }, 'GET', null, token);
};

// consume an inventory item
export const useItem = function (itemId, token, callback) {
    fetchMethod('/api/inventory/use', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Use Error", resData.message || "Use error"); callback({ message: resData.message }, null); }
    }, 'POST', { item_id: itemId }, token);
};

// GAME

// fetch available planets
export const fetchPlanets = function (token, callback) {
    fetchMethod('/api/planets', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Fetch Error", resData.message || "Fetch error"); callback({ message: resData.message }, null); }
    }, 'GET', null, token);
};

// fetch planet leaderboard
export const fetchPlanetLeaderboard = function (planetId, token, callback) {
    fetchMethod(`/api/planets/${planetId}/leaderboard`, function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Fetch Error", resData.message || "Fetch error"); callback({ message: resData.message }, null); }
    }, 'GET', null, token);
};

// start a game session
export const startGame = function (planetId, token, callback) {
    fetchMethod('/api/game/start', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Start Error", resData.message || "Start error"); callback({ message: resData.message }, null); }
    }, 'POST', { planet_id: planetId }, token);
};

// fetch session details
export const fetchSession = function (sessionId, token, callback) {
    fetchMethod(`/api/game/session/${sessionId}`, function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Fetch Error", resData.message || "Fetch error"); callback({ message: resData.message }, null); }
    }, 'GET', null, token);
};

// record an obstacle hit
export const recordHit = function (sessionId, token, callback) {
    fetchMethod('/api/game/hit', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Hit Error", resData.message || "Hit error"); callback({ message: resData.message }, null); }
    }, 'POST', { session_id: sessionId }, token);
};

// finalise game results
export const completeGame = function (data, token, callback) {
    fetchMethod('/api/game/complete', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Complete Error", resData.message || "Complete error"); callback({ message: resData.message }, null); }
    }, 'POST', data, token);
};

// abandon active session
export const abandonGame = function (sessionId, token, callback) {
    fetchMethod('/api/game/abandon', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Abandon Error", resData.message || "Abandon error"); callback({ message: resData.message }, null); }
    }, 'POST', { session_id: sessionId }, token);
};

// INTROSPECTION

// token introspection api
export const introspectToken = function (token, callback) {
    fetchMethod('/api/users/introspect', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Auth Error", resData.message || "Token invalid"); callback({ message: resData.message }, null); }
    }, 'GET', null, token);
};

// CHARACTER

// character customization api
export const fetchCharacter = function (token, callback) {
    fetchMethod('/api/character', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Character Error", resData.message || "Fetch error"); callback({ message: resData.message }, null); }
    }, 'GET', null, token);
};

// reset character config
export const deleteCharacter = function (token, callback) {
    fetchMethod('/api/character', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Delete Error", resData.message || "Delete error"); callback({ message: resData.message }, null); }
    }, 'DELETE', null, token);
};

// update character nano-suit
export const updateCharacter = function (formData, token, callback) {
    fetchMethod('/api/character', function (status, ok, resData) {
        if (ok) callback(null, resData);
        else { showErrorModal("Update Error", resData.message || "Update error"); callback({ message: resData.message }, null); }
    }, 'PUT', formData, token);
};

export { fetchMethod };

// EVENT LISTENERS

// global listener for expired sessions
document.addEventListener('auth:expired', function () {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});
