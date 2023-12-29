      // Function to delete a user
      function deleteUser(userId) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `/deleteUser?id=${userId}`, true);

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            // Update the table with the updated user data
            updateTable(JSON.parse(xhr.responseText));
          }
        };

        xhr.send();
      }
      // Function to update the table
      function updateTable(data) {
        const tableBody = document.querySelector('tbody');
        tableBody.innerHTML = '';

        data.forEach(user => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.dob}</td>
            <td>
              <button onclick="deleteUser(${user.id})">Delete</button>
              <button onclick="editUserForm(${user.id}, '${user.name}', '${user.email}', '${user.dob}')">Edit</button>
            </td>
          `;

          tableBody.appendChild(row);
        });
      }

      // Function to show the edit user form
      function editUserForm(userId, name, email, dob) {
        document.getElementById('editUserId').value = userId;
        document.getElementById('editName').value = name;
        document.getElementById('editEmail').value = email;
        document.getElementById('editDob').value = dob;

        document.getElementById('editUserFormContainer').style.display = 'block';
      }

      // Function to hide the edit user form
      function hideEditUserForm() {
        document.getElementById('editUserFormContainer').style.display = 'none';
      }

      // Initial table update when the page loads
      window.onload = function() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/', true);

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            // Update the table with the initial user data
            updateTable(JSON.parse(xhr.responseText));
          }
        };

        xhr.send();
      };