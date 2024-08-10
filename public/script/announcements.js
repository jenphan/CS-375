document.addEventListener('DOMContentLoaded', function() {
  const announcementList = document.getElementById('announcementList');
  const announcements = JSON.parse(localStorage.getItem('announcements')) || [];

  if (announcements.length === 0) {
      announcementList.innerHTML = '<li>No announcements available.</li>';
  } else {
      announcements.forEach(announcement => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `<strong>${announcement.title}</strong><br/>
                                <small>${announcement.date}</small><br/>
                                <p>${announcement.body}</p>`;
          announcementList.appendChild(listItem);
      });
  }
});
