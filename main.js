// Enhanced Professional Uber Demo - JavaScript

// Enhanced user management and UI interactions
document.addEventListener("DOMContentLoaded", () => {
  setYears();
  renderAuthArea();
  attachHandlers();
  initializePageSpecificFeatures();
});

// Set current year in footers
function setYears() {
  const yearElements = ['yearHome', 'yearSignIn', 'yearProfile', 'yearRides', 'yearCars'];
  const currentYear = new Date().getFullYear();
  
  yearElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = currentYear;
  });
}

// Enhanced HTML escaping
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe.toString().replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}

// Enhanced authentication area rendering
function renderAuthArea() {
  document.querySelectorAll('#authArea').forEach(authArea => {
    const user = getCurrentUser();
    
    if (user && user.email) {
      const userTypeIcon = getUserTypeIcon(user.type);
      const userTypeBadge = getUserTypeBadge(user.type);
      
      authArea.innerHTML = `
        <div class="d-flex align-items-center">
          <div class="user-info me-3">
            <span class="user-greeting">Hi, <strong>${escapeHtml(user.name || user.email.split('@')[0])}</strong></span>
            <small class="user-type-badge ${userTypeBadge.class}">${userTypeIcon} ${userTypeBadge.text}</small>
          </div>
          <div class="btn-group">
            <a class="btn btn-outline-primary btn-sm me-2" href="profile.html">
              <i class="bi bi-person-circle me-1"></i>Profile
            </a>
            <button id="navSignOutBtn" class="btn btn-outline-danger btn-sm">
              <i class="bi bi-box-arrow-right me-1"></i>Sign Out
            </button>
          </div>
        </div>`;

      const signOutBtn = authArea.querySelector('#navSignOutBtn');
      signOutBtn.addEventListener('click', handleSignOut);
    } else {
      authArea.innerHTML = `
        <div class="auth-buttons">
          <a class="btn btn-outline-primary btn-sm me-2" href="login.html">
            <i class="bi bi-box-arrow-in-right me-1"></i>Login
          </a>
          <a class="btn btn-primary btn-sm" href="signin.html">
            <i class="bi bi-person-plus-fill me-1"></i>Sign Up
          </a>
        </div>`;
    }
  });
}

// Get current user from localStorage
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('uber_user') || 'null');
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
}

// Get user type icon
function getUserTypeIcon(type) {
  const icons = {
    user: '<i class="bi bi-person-fill"></i>',
    driver: '<i class="bi bi-car-front-fill"></i>',
    admin: '<i class="bi bi-shield-check-fill"></i>'
  };
  return icons[type] || icons.user;
}

// Get user type badge
function getUserTypeBadge(type) {
  const badges = {
    user: { text: 'Passenger', class: 'badge-user' },
    driver: { text: 'Driver', class: 'badge-driver' },
    admin: { text: 'Admin', class: 'badge-admin' }
  };
  return badges[type] || badges.user;
}

// Enhanced sign out handler
function handleSignOut() {
  if (confirm('Are you sure you want to sign out?')) {
    localStorage.removeItem('uber_user');
    showNotification('You have been signed out successfully.', 'success');
    
    // Redirect to home page after a brief delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }
}

// Enhanced form handlers
function attachHandlers() {
  attachRideBookingHandler();
  attachSignInHandler();
  attachLoginHandler();
  attachContactFormHandler();
  attachForgotPasswordHandler();
  attachProfileHandlers();
}

// Enhanced ride booking handler
function attachRideBookingHandler() {
  const rideForm = document.getElementById('rideForm');
  if (!rideForm) return;

  rideForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const messageContainer = document.getElementById('rideMsg');
    
    const from = fromInput.value.trim();
    const to = toInput.value.trim();
    
    // Clear previous messages
    messageContainer.innerHTML = '';
    
    // Validation
    if (!from || !to) {
      showMessage(messageContainer, 'Please fill in both pickup and destination locations.', 'warning');
      return;
    }
    
    const user = getCurrentUser();
    if (!user) {
      showMessage(messageContainer, `
        <div class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          Please <a href="login.html" class="alert-link">sign in</a> to book a ride.
        </div>
      `);
      return;
    }
    
    // Simulate booking process
    const bookingBtn = rideForm.querySelector('.btn-book');
    const originalText = bookingBtn.innerHTML;
    
    bookingBtn.innerHTML = '<i class="bi bi-arrow-repeat spin me-2"></i>Searching...';
    bookingBtn.disabled = true;
    
    setTimeout(() => {
      const rideId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const estimatedPrice = Math.floor(Math.random() * 50) + 15;
      
      showMessage(messageContainer, `
        <div class="alert alert-success">
          <h6><i class="bi bi-check-circle-fill me-2"></i>Ride Booked Successfully!</h6>
          <div class="booking-details mt-2">
            <p class="mb-1"><strong>From:</strong> ${escapeHtml(from)}</p>
            <p class="mb-1"><strong>To:</strong> ${escapeHtml(to)}</p>
            <p class="mb-1"><strong>Booking ID:</strong> ${rideId}</p>
            <p class="mb-0"><strong>Estimated Cost:</strong> $${estimatedPrice}</p>
          </div>
          <div class="mt-2">
            <small class="text-muted">Driver will be assigned shortly. You'll receive a notification.</small>
          </div>
        </div>
      `);
      
      // Save ride to localStorage for demo purposes
      saveRideToHistory({
        id: rideId,
        from,
        to,
        date: new Date().toISOString(),
        status: 'Confirmed',
        price: estimatedPrice,
        userEmail: user.email
      });
      
      rideForm.reset();
      bookingBtn.innerHTML = originalText;
      bookingBtn.disabled = false;
    }, 2000);
  });
}

// Enhanced sign-in handler (registration)
function attachSignInHandler() {
  const form = document.getElementById('signinPageForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = collectSignInFormData();
    const validation = validateSignInForm(formData);
    
    if (!validation.valid) {
      showSignInError(validation.message);
      highlightInvalidFields(validation.invalidFields);
      return;
    }
    
    // Simulate account creation
    const submitBtn = form.querySelector('.auth-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin me-2"></i>Creating Account...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      const user = {
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        type: formData.userType,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('uber_user', JSON.stringify(user));
      showNotification(`Welcome ${user.name}! Your ${user.type} account has been created.`, 'success');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }, 2000);
  });
}

// Enhanced login handler
function attachLoginHandler() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorContainer = document.getElementById('loginError');
    
    errorContainer.style.display = 'none';
    
    if (!email || !password) {
      showLoginError('Please enter both email and password.');
      return;
    }
    
    if (!isValidEmail(email)) {
      showLoginError('Please enter a valid email address.');
      return;
    }
    
    // Simulate login process
    const submitBtn = form.querySelector('.auth-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin me-2"></i>Signing In...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      // For demo purposes, create user from email
      const user = {
        email,
        name: email.split('@')[0],
        type: 'user',
        loginAt: new Date().toISOString()
      };
      
      localStorage.setItem('uber_user', JSON.stringify(user));
      showNotification(`Welcome back, ${user.name}!`, 'success');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }, 2000);
  });
}

// Contact form handler
function attachContactFormHandler() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const messageContainer = document.getElementById('contactMsg');
    
    if (!name || !email || !message) {
      showMessage(messageContainer, 'Please fill in all contact fields.', 'warning');
      return;
    }
    
    if (!isValidEmail(email)) {
      showMessage(messageContainer, 'Please enter a valid email address.', 'danger');
      return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin me-2"></i>Sending...';
    submitBtn.disabled = true;
    
    // Simulate sending
    setTimeout(() => {
      showMessage(messageContainer, 'Thank you for your message! We\'ll get back to you soon.', 'success');
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });
}

// Forgot password handler
function attachForgotPasswordHandler() {
  const form = document.getElementById('forgotPasswordForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value.trim();
    const messageContainer = document.getElementById('resetMessage');
    
    if (!email || !isValidEmail(email)) {
      showMessage(messageContainer, 'Please enter a valid email address.', 'danger');
      return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin me-2"></i>Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      showMessage(messageContainer, 'Password reset link sent to your email!', 'success');
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      setTimeout(() => {
        $('#forgotPasswordModal').modal('hide');
      }, 2000);
    }, 2000);
  });
}

// Profile page handlers
function attachProfileHandlers() {
  const profileContent = document.getElementById('profileContent');
  if (!profileContent) return;

  const user = getCurrentUser();
  if (!user) {
    profileContent.innerHTML = `
      <div class="alert alert-warning">
        <i class="bi bi-exclamation-triangle me-2"></i>
        You are not signed in. <a href="login.html" class="alert-link">Sign in</a> to view your profile.
      </div>`;
    return;
  }

  renderUserProfile(profileContent, user);
}

// Page-specific feature initialization
function initializePageSpecificFeatures() {
  // Auto-load data for specific pages
  if (document.getElementById('ridesContainer')) {
    fetchMyRides();
  }
  if (document.getElementById('carsContainer')) {
    fetchCars();
  }
  
  // Initialize tooltips if available
  if (typeof $?.fn.tooltip === 'function') {
    $('[data-toggle="tooltip"]').tooltip();
  }
}

// Utility Functions

// Collect sign-in form data
function collectSignInFormData() {
  return {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    email: document.getElementById('emailPage').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    password: document.getElementById('passwordPage').value,
    confirmPassword: document.getElementById('confirmPassword').value,
    userType: document.querySelector('input[name="userType"]:checked').value,
    agreeTerms: document.getElementById('agreeTerms').checked
  };
}

// Validate sign-in form
function validateSignInForm(data) {
  const invalidFields = [];
  let message = '';

  if (!data.firstName) invalidFields.push('firstName');
  if (!data.lastName) invalidFields.push('lastName');
  if (!data.email || !isValidEmail(data.email)) invalidFields.push('emailPage');
  if (!data.phone) invalidFields.push('phone');
  if (!data.password || data.password.length < 6) invalidFields.push('passwordPage');
  if (data.password !== data.confirmPassword) invalidFields.push('confirmPassword');
  if (!data.agreeTerms) invalidFields.push('agreeTerms');

  if (invalidFields.length > 0) {
    message = 'Please correct the highlighted fields.';
    return { valid: false, message, invalidFields };
  }

  return { valid: true };
}

// Highlight invalid form fields
function highlightInvalidFields(fields) {
  // Clear previous highlights
  document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  
  // Add highlights to invalid fields
  fields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) field.classList.add('is-invalid');
  });
}

// Email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show messages in containers
function showMessage(container, message, type = 'info') {
  if (!container) return;
  
  const alertClass = `alert alert-${type}`;
  container.innerHTML = `<div class="${alertClass}">${message}</div>`;
  
  // Auto-hide success messages
  if (type === 'success') {
    setTimeout(() => {
      container.innerHTML = '';
    }, 5000);
  }
}

// Show sign-in errors
function showSignInError(message) {
  const errorContainer = document.getElementById('signinPageError');
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
  }
}

// Show login errors
function showLoginError(message) {
  const errorContainer = document.getElementById('loginError');
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
  }
}

// Show notifications (could be enhanced with a notification system)
function showNotification(message, type = 'info') {
  // Simple alert for now - could be enhanced with toast notifications
  alert(message);
}

// Password toggle functionality
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.parentNode.querySelector('.password-toggle, .password-toggle-btn');
  const icon = button.querySelector('i');
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'bi bi-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'bi bi-eye';
  }
}

// Quick login functionality
function quickLogin(type) {
  const users = {
    user: { email: 'user@demo.com', name: 'John Doe', type: 'user' },
    driver: { email: 'driver@demo.com', name: 'Mike Johnson', type: 'driver' },
    admin: { email: 'admin@demo.com', name: 'Sarah Admin', type: 'admin' }
  };
  
  const user = users[type];
  if (user) {
    localStorage.setItem('uber_user', JSON.stringify({
      ...user,
      loginAt: new Date().toISOString()
    }));
    
    showNotification(`Logged in as ${user.name} (${user.type})`, 'success');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
}

// Show forgot password modal
function showForgotPassword() {
  const modal = document.getElementById('forgotPasswordModal');
  if (modal) {
    $(modal).modal('show');
  }
}

// Render user profile
function renderUserProfile(container, user) {
  const userTypeInfo = getUserTypeInfo(user.type);
  
  container.innerHTML = `
    <div class="row">
      <div class="col-md-4 text-center mb-4">
        <div class="profile-avatar">
          <div class="avatar-circle">
            ${getUserTypeIcon(user.type)}
          </div>
          <h5 class="mt-3">${escapeHtml(user.name)}</h5>
          <span class="badge ${userTypeInfo.badgeClass}">${userTypeInfo.text}</span>
        </div>
      </div>
      <div class="col-md-8">
        <div class="profile-details">
          <div class="detail-item">
            <label>Full Name:</label>
            <span>${escapeHtml(user.name)}</span>
          </div>
          <div class="detail-item">
            <label>Email:</label>
            <span>${escapeHtml(user.email)}</span>
          </div>
          <div class="detail-item">
            <label>Account Type:</label>
            <span>${escapeHtml(userTypeInfo.text)}</span>
          </div>
          <div class="detail-item">
            <label>Phone:</label>
            <span>${escapeHtml(user.phone || 'Not provided')}</span>
          </div>
          <div class="detail-item">
            <label>Member Since:</label>
            <span>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
        
        <div class="profile-actions mt-4">
          <button id="editProfileBtn" class="btn btn-primary me-2">
            <i class="bi bi-pencil-square me-2"></i>Edit Profile
          </button>
          <button id="profileSignOutBtn" class="btn btn-outline-danger">
            <i class="bi bi-box-arrow-right me-2"></i>Sign Out
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach profile action handlers
  const editBtn = container.querySelector('#editProfileBtn');
  const signOutBtn = container.querySelector('#profileSignOutBtn');
  
  editBtn.addEventListener('click', () => editProfile(user));
  signOutBtn.addEventListener('click', handleSignOut);
}

// Get user type info
function getUserTypeInfo(type) {
  const info = {
    user: { text: 'Passenger', badgeClass: 'badge-primary' },
    driver: { text: 'Professional Driver', badgeClass: 'badge-success' },
    admin: { text: 'System Administrator', badgeClass: 'badge-danger' }
  };
  return info[type] || info.user;
}

// Edit profile functionality
function editProfile(user) {
  const newName = prompt('Enter new display name:', user.name);
  if (newName && newName.trim() !== user.name) {
    user.name = newName.trim();
    localStorage.setItem('uber_user', JSON.stringify(user));
    showNotification('Profile updated successfully!', 'success');
    setTimeout(() => location.reload(), 1000);
  }
}

// Save ride to history (demo purposes)
function saveRideToHistory(ride) {
  try {
    const rides = JSON.parse(localStorage.getItem('uber_rides') || '[]');
    rides.unshift(ride);
    // Keep only last 10 rides
    localStorage.setItem('uber_rides', JSON.stringify(rides.slice(0, 10)));
  } catch (e) {
    console.error('Error saving ride:', e);
  }
}

// Data fetching functions

// Fetch user rides
async function fetchMyRides() {
  const container = document.getElementById('ridesContainer');
  if (!container) return;

  container.innerHTML = '<div class="text-center py-4"><i class="bi bi-arrow-repeat spin me-2"></i>Loading rides...</div>';
  
  const user = getCurrentUser();
  
  // Simulate API delay
  setTimeout(() => {
    try {
      const savedRides = JSON.parse(localStorage.getItem('uber_rides') || '[]');
      const userRides = savedRides.filter(ride => !user || ride.userEmail === user.email);
      
      if (userRides.length === 0) {
        // Show demo data
        const demoRides = [
          {
            id: 'DEMO001',
            from: 'Downtown Cairo',
            to: 'Giza Pyramids',
            date: new Date(Date.now() - 86400000).toISOString(),
            status: 'Completed',
            price: 45
          },
          {
            id: 'DEMO002',
            from: 'Maadi',
            to: 'New Cairo',
            date: new Date(Date.now() - 172800000).toISOString(),
            status: 'Completed',
            price: 35
          }
        ];
        renderRides(container, demoRides);
      } else {
        renderRides(container, userRides);
      }
    } catch (e) {
      container.innerHTML = '<div class="alert alert-danger">Error loading rides.</div>';
    }
  }, 1000);
}

// Render rides
function renderRides(container, rides) {
  if (!rides.length) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-car-front" style="font-size: 3rem; color: #ccc;"></i>
        <h5 class="mt-3">No rides yet</h5>
        <p class="text-muted">Book your first ride to see your history here.</p>
        <a href="index.html" class="btn btn-primary">Book a Ride</a>
      </div>`;
    return;
  }

  container.innerHTML = '';
  
  rides.forEach(ride => {
    const statusClass = ride.status === 'Completed' ? 'success' : 'warning';
    const statusIcon = ride.status === 'Completed' ? 'check-circle' : 'clock';
    
    const rideCard = document.createElement('div');
    rideCard.className = 'card mb-3 ride-card';
    rideCard.innerHTML = `
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="ride-route">
              <div class="route-item">
                <i class="bi bi-geo-alt-fill text-success me-2"></i>
                <strong>${escapeHtml(ride.from)}</strong>
              </div>
              <div class="route-line"></div>
              <div class="route-item">
                <i class="bi bi-geo-alt-fill text-danger me-2"></i>
                <strong>${escapeHtml(ride.to)}</strong>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="ride-details">
              <small class="text-muted">Ride ID: ${escapeHtml(ride.id)}</small>
              <div class="text-muted">${new Date(ride.date).toLocaleDateString()}</div>
              <div class="text-muted">${new Date(ride.date).toLocaleTimeString()}</div>
            </div>
          </div>
          <div class="col-md-3 text-end">
            <div class="ride-status">
              <div class="price-tag">${ride.price ? '$' + ride.price : 'N/A'}</div>
              <span class="badge badge-${statusClass}">
                <i class="bi bi-${statusIcon} me-1"></i>${escapeHtml(ride.status)}
              </span>
            </div>
          </div>
        </div>
      </div>`;
    
    container.appendChild(rideCard);
  });
}

// Fetch cars
async function fetchCars() {
  const container = document.getElementById('carsContainer');
  if (!container) return;

  container.innerHTML = '<div class="col-12 text-center py-4"><i class="bi bi-arrow-repeat spin me-2"></i>Loading vehicles...</div>';
  
  setTimeout(() => {
    const demoCars = [
      {
        id: 1,
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        plate: 'ABC-1234',
        type: 'Sedan',
        features: ['AC', 'GPS', 'Bluetooth'],
        rating: 4.8,
        image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 2,
        make: 'Honda',
        model: 'CR-V',
        year: 2023,
        plate: 'XYZ-5678',
        type: 'SUV',
        features: ['AC', 'GPS', 'WiFi', 'USB'],
        rating: 4.9,
        image: 'https://images.pexels.com/photos/1051073/pexels-photo-1051073.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 3,
        make: 'BMW',
        model: '5 Series',
        year: 2023,
        plate: 'LUX-9999',
        type: 'Luxury',
        features: ['Leather', 'Premium Sound', 'Climate Control'],
        rating: 5.0,
        image: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ];
    
    renderCars(container, demoCars);
  }, 1000);
}

// Render cars
function renderCars(container, cars) {
  container.innerHTML = '';
  
  if (!cars.length) {
    container.innerHTML = '<div class="col-12 alert alert-info">No vehicles available at the moment.</div>';
    return;
  }

  cars.forEach(car => {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';
    
    col.innerHTML = `
      <div class="card car-card">
        <img src="${car.image}" class="card-img-top" alt="${car.make} ${car.model}">
        <div class="card-body">
          <h5 class="card-title">${escapeHtml(car.make)} ${escapeHtml(car.model)}</h5>
          <div class="car-details mb-3">
            <div class="detail-row">
              <span class="text-muted">Year:</span>
              <span>${car.year}</span>
            </div>
            <div class="detail-row">
              <span class="text-muted">Type:</span>
              <span class="badge badge-secondary">${escapeHtml(car.type)}</span>
            </div>
            <div class="detail-row">
              <span class="text-muted">Plate:</span>
              <span>${escapeHtml(car.plate)}</span>
            </div>
            <div class="detail-row">
              <span class="text-muted">Rating:</span>
              <span class="text-warning">
                ${generateStars(car.rating)} ${car.rating}
              </span>
            </div>
          </div>
          <div class="car-features mb-3">
            ${car.features.map(feature => `<span class="badge badge-light me-1">${feature}</span>`).join('')}
          </div>
          <button class="btn btn-primary btn-block" onclick="selectCar(${car.id})">
            <i class="bi bi-check-circle me-2"></i>Select Vehicle
          </button>
        </div>
      </div>`;
    
    container.appendChild(col);
  });
}

// Generate star rating
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="bi bi-star-fill"></i>';
  }
  
  if (halfStar) {
    stars += '<i class="bi bi-star-half"></i>';
  }
  
  return stars;
}

// Select car functionality
function selectCar(carId) {
  showNotification(`Vehicle selected! (Car ID: ${carId})`, 'success');
  // Could integrate with booking system
}

// Enhanced CSS for ride cards and other elements (add to existing styles)
const additionalStyles = `
<style>
.ride-card {
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.ride-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.ride-route {
  position: relative;
}

.route-item {
  display: flex;
  align-items: center;
  margin: 8px 0;
}

.route-line {
  width: 2px;
  height: 20px;
  background: #ddd;
  margin: 4px 0 4px 11px;
}

.price-tag {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
}

.car-card {
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.car-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.car-card img {
  height: 200px;
  object-fit: cover;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.user-type-badge {
  display: block;
  font-size: 0.75rem;
  margin-top: 2px;
}

.badge-user { background-color: var(--primary); color: white; }
.badge-driver { background-color: var(--secondary); color: white; }
.badge-admin { background-color: var(--danger); color: white; }

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.profile-avatar .avatar-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  margin: 0 auto;
}

.profile-details .detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.profile-details .detail-item:last-child {
  border-bottom: none;
}

.profile-details label {
  font-weight: 600;
  color: var(--muted);
}
</style>
`;

// Inject additional styles
if (!document.head.querySelector('#additional-styles')) {
  document.head.insertAdjacentHTML('beforeend', additionalStyles.replace('<style>', '<style id="additional-styles">'));
}