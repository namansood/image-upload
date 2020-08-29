document.querySelector('#testingbutton').addEventListener('click', function() {
	location.href = '/images/' + document.querySelector('#photoid').value;
});

document.querySelector('#adddelinput').addEventListener('click', function(e) {
	const el = e.target.parentElement;

	const input = document.createElement('input');
	input.type = 'text';
	const br = document.createElement('br');

	el.appendChild(input);
	el.appendChild(br);
});

document.querySelector('#senddelrequest').addEventListener('click', function(e) {
	const el = e.target.parentElement;

	const inputs = el.querySelectorAll('input[type="text"]');

	const request = {
		files: []
	};

	for(input of inputs) {
		const a = input.value.split(',');
		request.files.push({
			id: a[0],
			password: a[1]
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
	.then(response => {
		console.log(response);
		alert('See response in console');
	});
});
