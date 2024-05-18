let WavesControl = (function () {
	return {
		init: function (containerId, action, key) {
			let container = document.getElementById(containerId);

			container.innerHTML = `
			<div class="waves-container">  
				~~~
			</div>
      `;

			container.addEventListener('mouseup', ()=> { animate(); action(key); });
			container.addEventListener('touchend', ()=> { animate(); action(key); });
			
			document.addEventListener('DOMContentLoaded', animate);

			const color1 = generateRandomColor();
			const color2 = generateRandomColor();

		
			const bodyElement = document.body;
			bodyElement.style.backgroundColor = color1;
			const waves = document.querySelector('.waves-container');
			waves.style.backgroundColor = color1;
			waves.style.color = color2;


			function generateRandomColor() {
				const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
				return randomColor;
			}
			
			function animate () {
				let waves = document.querySelector('.waves-container');
				waves.classList.add('shake-animation');
			
				waves.addEventListener('animationiteration', onAnimationIteration); 
			
				function onAnimationIteration(event) {
					if (event.animationName === 'shake') {
						// Decrement the iteration count
						waves.dataset.iterations = (parseInt(waves.dataset.iterations) || 0) + 1;
			
						// If the animation has played 2 times, remove the animation class
						if (parseInt(waves.dataset.iterations) === 1) {
							waves.classList.remove('shake-animation');
							waves.dataset.iterations = 0;
						}
					}
				}
			}

			animate();	
		},
	};
})();



export default WavesControl;