document.addEventListener('DOMContentLoaded', function() {
  const registerButton = document.getElementById('register-button');
  const registrationForm = document.getElementById('registration-form');
  const registrationSection = document.getElementById('registration');
  const dashboardSection = document.getElementById('dashboard');
  const calendarButton = document.getElementById('calendarButton');
  const createEventButton = document.getElementById('createEventButton');
  const deleteEventButton = document.getElementById('deleteEventButton');
  const calendarContainer = document.getElementById('calendarContainer');
  const adminButton = document.getElementById('admin-button');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminLoginSection = document.getElementById('admin-login');
  const adminPanel = document.getElementById('adminPanel');
  const createMemberButton = document.getElementById('createMemberButton');
  const deleteMemberButton = document.getElementById('deleteMemberButton');
  const createMemberForm = document.getElementById('createMemberForm');
  const newMemberForm = document.getElementById('newMemberForm');
  const memberList = document.getElementById('memberList');
  const loggedInUserSpan = document.getElementById('loggedInUser');
  const logoutButton = document.getElementById('logout-button');
  const activeMemberList = document.getElementById('activeMemberList');
  const deletedMemberList = document.getElementById('deletedMemberList');
  const adminList = document.getElementById('adminList'); // Get reference to adminList div

  let selectedEvent = null; // To keep track of the selected event
  let members = [
    { username: "Alina", password: "Eder" } // Added new member
  ]; // Array to store member data
  let deletedMembers = []; // Array to store deleted member data
  let events = []; // Array to store event data

  // Sample admin users (replace with your database or secure storage)
  const adminUsers = [
    { username: "Florian", password: "FuerstAdmin" },
    { username: "Marcel", password: "EderAdmin" }
  ];

  // Function to show the registration form
  function showRegistration() {
    registrationSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    adminLoginSection.style.display = 'none';
  }

  // Function to show the admin login form
  function showAdminLogin() {
    adminLoginSection.style.display = 'block';
    registrationSection.style.display = 'none';
    dashboardSection.style.display = 'none';
  }

  // Show the registration form when the "Anmelden" button is clicked
  registerButton.addEventListener('click', showRegistration);

  // Show the admin login form when the "Admin" button is clicked
  adminButton.addEventListener('click', showAdminLogin);

  // Handle the registration form submission
  registrationForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if the username and password exist in the members array
    const existingMember = members.find(member => member.username === username && member.password === password);

    if (existingMember) {
      registrationSection.style.display = 'none';
      dashboardSection.style.display = 'block';
      loggedInUserSpan.textContent = username; // Display the logged-in user's name
      initializeCalendar(); // Initialize the calendar after login
      logoutButton.style.display = 'block'; // Show logout button
    } else {
      alert('Falscher Nutzername oder Passwort');
    }
  });

  // Handle the admin login form submission
  adminLoginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const adminUsername = document.getElementById('adminUsername').value;
    const adminPassword = document.getElementById('adminPassword').value;

    const validAdmin = adminUsers.find(admin => admin.username === adminUsername && admin.password === adminPassword);

    if (validAdmin) {
      adminLoginSection.style.display = 'none';
      dashboardSection.style.display = 'block';
      loggedInUserSpan.textContent = adminUsername; // Display the logged-in admin's name
      initializeCalendar();
      adminPanel.style.display = 'block'; // Show the admin panel
      updateMemberCount();
      displayMemberList();
      createEventButton.style.display = 'block';
      deleteEventButton.style.display = 'block';
      logoutButton.style.display = 'block'; // Show logout button
    } else {
      alert('Falscher Admin-Nutzername oder Passwort');
    }
  });

  // Logout functionality
  logoutButton.addEventListener('click', function() {
    // Hide dashboard and show login buttons
    dashboardSection.style.display = 'none';
    registrationSection.style.display = 'none';
    adminLoginSection.style.display = 'none';
    adminPanel.style.display = 'none'; // Hide admin panel

    // Reset logged-in user display
    loggedInUserSpan.textContent = '';
    logoutButton.style.display = 'none'; // Hide logout button

    // Clear events and members (for demonstration, in reality, use data persistence)
    events = [];
    members = [];
    deletedMembers = []; 
    selectedEvent = null;
    updateMemberCount();
    displayMemberList();
    initializeCalendar();
  });

  function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'de',
      events: events,
      eventClick: function(info) {
        selectedEvent = info.event;
      }
    });
    calendar.render();

    calendarButton.addEventListener('click', function() {
      calendarContainer.style.display = 'block';
    });

    deleteEventButton.addEventListener('click', function() {
      if (selectedEvent) {
        const eventId = selectedEvent.id;
        calendar.getEventById(eventId).remove();
        selectedEvent = null;
        const eventIndex = events.findIndex(event => event.id === eventId);
        if (eventIndex !== -1) {
          events.splice(eventIndex, 1);
        }
      }
    });

    createEventButton.addEventListener('click', function() {
      // Create a form for event details
      const eventFormHTML = `
        <form id="newEventForm">
          <label for="eventTitle">Titel:</label>
          <input type="text" id="eventTitle" name="eventTitle" required>

          <label for="eventDate">Datum:</label>
          <input type="date" id="eventDate" name="eventDate" required>

          <label for="eventReason">Grund:</label>
          <input type="text" id="eventReason" name="eventReason" required>

          <label for="eventCreatedBy">Erstellt von:</label>
          <input type="text" id="eventCreatedBy" name="eventCreatedBy" required>

          <button type="submit">Termin speichern</button>
        </form>
      `;

      // Display the form
      calendarContainer.innerHTML = eventFormHTML;

      // Handle form submission
      const newEventForm = document.getElementById('newEventForm');
      newEventForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('eventTitle').value;
        const date = document.getElementById('eventDate').value;
        const reason = document.getElementById('eventReason').value;
        const createdBy = document.getElementById('eventCreatedBy').value;

        // Create the event
        const newEvent = {
          id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          title: title,
          start: date,
          extendedProps: {
            reason: reason,
            createdBy: createdBy
          }
        };

        // Add the event to the calendar
        calendar.addEvent(newEvent);

        // Add the event to the events array
        events.push(newEvent);

        // Reset the form
        newEventForm.reset();

        // Hide the form
        calendarContainer.innerHTML = ''; // Clear the form
        calendarContainer.appendChild(calendarEl); // Re-add the calendar
        calendar.render();
      });
    });
  }

  function updateMemberCount() {
    const memberCountSpan = document.getElementById('memberCount');
    memberCountSpan.textContent = members.length;
  }

  function displayMemberList() {
    activeMemberList.innerHTML = ''; // Clear the previous lists
    deletedMemberList.innerHTML = '';
    adminList.innerHTML = '';

    // Display admins
    adminUsers.forEach(admin => {
      const adminItem = document.createElement('p');
      adminItem.textContent = admin.username;
      adminList.appendChild(adminItem);
    });

    // Display active members
    members.forEach(member => {
      const memberItem = document.createElement('div');
      memberItem.innerHTML = `
        <p>${member.username} - ${member.password}</p>
        <button onclick="deleteMember('${member.username}')">Mitglied löschen</button>
      `;
      activeMemberList.appendChild(memberItem);
    });

    // Display deleted members
    deletedMembers.forEach(member => {
      const memberItem = document.createElement('div');
      memberItem.innerHTML = `
        <p>${member.username} - ${member.password}</p>
        <button onclick="forgiveMember('${member.username}')">Mitglied verzeihen</button>
      `;
      deletedMemberList.appendChild(memberItem);
    });
  }

  createMemberButton.addEventListener('click', function() {
    createMemberForm.style.display = 'block';
  });

  // Delete Member Functionality
  function deleteMember(username) {
    const memberToDelete = members.find(member => member.username === username);
    if (memberToDelete) {
      const index = members.indexOf(memberToDelete);
      if (index !== -1) {
        members.splice(index, 1); // Remove from active members
        deletedMembers.push(memberToDelete); // Add to deleted members
        updateMemberCount();
        displayMemberList();
      }
    }
  }

  // Forgive Member Functionality
  function forgiveMember(username) {
    const memberToForgive = deletedMembers.find(member => member.username === username);
    if (memberToForgive) {
      const index = deletedMembers.indexOf(memberToForgive);
      if (index !== -1) {
        deletedMembers.splice(index, 1); // Remove from deleted members
        members.push(memberToForgive); // Add back to active members
        updateMemberCount();
        displayMemberList();
      }
    }
  }

  newMemberForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const memberUsername = document.getElementById('memberUsername').value;
    const memberPassword = document.getElementById('memberPassword').value;

    const newMember = {
      username: memberUsername,
      password: memberPassword
    };

    members.push(newMember);
    updateMemberCount();
    displayMemberList();

    // Reset the form
    newEventForm.reset();

    // Hide the form
    createMemberForm.style.display = 'none';
  });

  // Get references to the elements you want to update
  const membershipFeeSpan = document.getElementById('membershipFee');
  const totalIncomeSpan = document.getElementById('totalIncome');

  // Calculate and display the financial information
  const membershipFee = 15; // €
  const numMembers = members.length;
  const totalIncome = membershipFee * numMembers; // Calculation is done here

  membershipFeeSpan.textContent = membershipFee + '€';
  totalIncomeSpan.textContent = totalIncome + '€';

  // This function should be called after the calendar is rendered
  function updateFinancialInfo() {
    const numMembers = members.length;
    const totalIncome = membershipFee * numMembers;
    membershipFeeSpan.textContent = membershipFee + '€';
    totalIncomeSpan.textContent = totalIncome + '€';
  }
});