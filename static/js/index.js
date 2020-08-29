document.querySelector('#imgget').addEventListener('click', function() {
	const img = document.querySelector('#imggetresult img');
	const urlBox = document.querySelector('#imggetresult .title');
	const url = location.protocol + '//' + location.host + 
				'/images/' + document.querySelector('#photoid').value;
	img.src = url + '?random=' + Date.now();
	img.style.display = 'block';
	urlBox.innerHTML = url;
});

document.querySelector('#adddelinput').addEventListener('click', function(e) {
	e.preventDefault();

	const el = e.target.parentElement.querySelector('.delinputs');

	const container = document.createElement('div');
	container.classList.add('delitem');

	const idInput = document.createElement('input');
	idInput.setAttribute('type', 'text');
	idInput.setAttribute('placeholder', 'Image ID');
	idInput.classList.add('del-id-input');

	const pwInput = document.createElement('input');
	pwInput.setAttribute('type', 'text');
	pwInput.setAttribute('placeholder', 'Deletion password');
	pwInput.classList.add('del-pw-input');

	const closeButton = document.createElement('div');
	closeButton.classList.add('close-button');
	closeButton.addEventListener('click', function() {
		container.remove();
	});

	container.appendChild(idInput);
	container.appendChild(pwInput);
	container.appendChild(closeButton);

	el.appendChild(container);
});

document.querySelector('#senddelrequest').addEventListener('click', function(e) {
	const el = e.target.parentElement.querySelector('.delinputs');

	const inputs = el.querySelectorAll('.delitem');

	const request = {
		files: []
	};

	for(input of inputs) {
		request.files.push({
			id: input.querySelector('.del-id-input').value,
			password: input.querySelector('.del-pw-input').value
		});
	}

	fetch('/images/delete', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(request)
	})
	.then(data => data.json())
	.then(obj => {
		document.querySelector('#imgdeleteresult code').innerHTML = JSON.stringify(obj, null, 2);
	});
});

document.querySelector('#imguploadform').addEventListener('submit', function(e) {
	e.preventDefault();
});

document.querySelector('#photos').addEventListener('change', function() {
	const form = document.querySelector('#imguploadform');
	const formData = new FormData(form);

	fetch(form.getAttribute('action'), {
		method: 'POST',
		body: formData
	})
	.then(data => data.json())
	.then(obj => {
		document.querySelector('#imguploadresult code').innerHTML = JSON.stringify(obj, null, 2).trim();
	})
})