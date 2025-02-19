// Handle regular signup
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (response.ok) {
            window.location.href = '/teams';
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('An error occurred during signup');
    }
});

// Handle login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (response.ok) {
            window.location.href = '/teams';
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('An error occurred during login');
    }
});

// Handle Google Sign In
function handleGoogleSignIn(response) {
    fetch('/api/users/google-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: response.credential
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        } else {
            alert(data.error);
        }
    })
    .catch(error => {
        alert('An error occurred during Google sign in');
    });
}

// Add logout handler
document.getElementById('logoutLink')?.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('/api/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            window.location.href = '/auth/login';
        } else {
            alert('Logout failed');
        }
    } catch (error) {
        alert('An error occurred during logout');
    }
}); 