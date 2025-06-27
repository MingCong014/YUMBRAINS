// script.js
// Initialize Facebook SDK
window.fbAsyncInit = function() {
  FB.init({
    appId: 'YOUR_FACEBOOK_APP_ID',
    cookie: true,
    xfbml: true,
    version: 'v19.0'
  });
  
  FB.AppEvents.logPageView();
};

// Generate background bubbles
function createBubbles() {
  const bubblesContainer = document.querySelector('.bubbles');
  const bubbleCount = 15;
  
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    // Random size
    const size = Math.random() * 80 + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // Random position
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.bottom = `-${size}px`;
    
    // Random animation duration
    const duration = Math.random() * 20 + 10;
    bubble.style.animationDuration = `${duration}s`;
    
    // Random animation delay
    bubble.style.animationDelay = `${Math.random() * 5}s`;
    
    bubblesContainer.appendChild(bubble);
  }
}

// Handle Google Sign-In
function handleGoogleSignIn(response) {
  // Decode the JWT response
  const responsePayload = parseJwt(response.credential);
  
  // Show user info
  document.getElementById('userAvatar').src = responsePayload.picture;
  document.getElementById('userName').textContent = responsePayload.name;
  document.getElementById('userEmail').textContent = responsePayload.email;
  document.getElementById('userProvider').textContent = 'Signed in with Google';
  
  // Show the user info section
  document.getElementById('userInfo').classList.add('visible');
}

// Handle Facebook Login
function checkFacebookLoginState() {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      // Logged into your webpage and Facebook.
      FB.api('/me', { fields: 'name,email,picture' }, function(response) {
        document.getElementById('userAvatar').src = response.picture.data.url;
        document.getElementById('userName').textContent = response.name;
        document.getElementById('userEmail').textContent = response.email || 'No email provided';
        document.getElementById('userProvider').textContent = 'Signed in with Facebook';
        
        // Show the user info section
        document.getElementById('userInfo').classList.add('visible');
      });
    }
  });
}

// Handle Instagram Login (simulated for demo)
document.getElementById('instagramLogin').addEventListener('click', function() {
  // In a real app, this would open the Instagram OAuth flow
  // For demo purposes, we'll simulate a successful login
  document.getElementById('userAvatar').src = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png';
  document.getElementById('userName').textContent = 'Instagram User';
  document.getElementById('userEmail').textContent = 'user@instagram.com';
  document.getElementById('userProvider').textContent = 'Signed in with Instagram';
  
  // Show the user info section
  document.getElementById('userInfo').classList.add('visible');
});

// JWT parser
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  
  return JSON.parse(jsonPayload);
}

// Continue to prototype
document.getElementById('continueBtn').addEventListener('click', function() {
  const loginContainer = document.getElementById('loginContainer');
  const loading = document.getElementById('loading');
  
  // Hide login and show loading
  loginContainer.classList.add('hidden');
  loading.classList.add('visible');
  
  // After a short delay, show the prototype
  setTimeout(function() {
    loading.classList.remove('visible');
    document.getElementById('prototypeContainer').style.display = 'block';
    loadFigmaPrototype();
  }, 1500);
});

// Figma prototype configuration
const figmaUrl = "https://embed.figma.com/proto/cK32N2wLKWvMXvx25eiic0/YUMBRAINS_New?node-id=0-1&embed-host=share&scaling=scale-up&viewport-fit=cover&starting-point-node-id=0-1&hide-ui=1&enable-interaction=1";
const iframe = document.getElementById('iframe-prototype');

function loadFigmaPrototype() {
  iframe.src = figmaUrl;
  
  // Fallback mechanism
  iframe.onload = function() {
    if(iframe.contentDocument.body.innerHTML === "") {
      console.log("Reloading to bypass security headers...");
      setTimeout(() => {
        iframe.src = figmaUrl + "&reload=" + Date.now();
      }, 500);
    }
  };
  
  setTimeout(() => {
    if(iframe.contentDocument.body.innerHTML === "") {
      console.log("Adding manual refresh button");
      const refreshBtn = document.createElement('div');
      refreshBtn.innerHTML = "Click to Load Prototype";
      refreshBtn.style.position = 'absolute';
      refreshBtn.style.top = '100%';
      refreshBtn.style.left = '100%';
      refreshBtn.style.transform = 'translate(-50%, -50%)';
      refreshBtn.style.color = 'white';
      refreshBtn.style.cursor = 'pointer';
      refreshBtn.style.zIndex = '30';
      refreshBtn.addEventListener('click', () => {
        iframe.src = figmaUrl + "&reload=" + Date.now();
        refreshBtn.remove();
      });
      document.querySelector('.prototype-container').appendChild(refreshBtn);
    }
  }, 3000);
}

// Initialize bubbles on load
window.addEventListener('load', createBubbles);