var CrossControl = (function () {
	return {
		init: function (containerId, action) {
			var container = document.getElementById(containerId);
			if (!container) {
				console.error('Container element not found');
				return;
			}

			container.innerHTML = `
        <div class="cross-control">
          <div class="cross-arm horizontal"></div>
          <div class="cross-arm vertical"></div>
        </div>
      `;

			document.addEventListener('DOMContentLoaded', function () {
				var cross = document.querySelector('.cross-control');
				cross.classList.add('spin-animation');

				cross.addEventListener('animationiteration', onAnimationIteration);

				function onAnimationIteration(event) {
					if (event.animationName === 'spin') {
						// Decrement the iteration count
						cross.dataset.iterations = (parseInt(cross.dataset.iterations) || 0) + 1;

						// If the animation has played 2 times, remove the animation class
						if (parseInt(cross.dataset.iterations) === 1) {
							cross.classList.remove('spin-animation');
						}
					}
				}
			});

			var cross = document.querySelector('.cross-control');
			var startX, startY;
			let startAngle = 0;

			cross.addEventListener('touchstart', dragStart);
			cross.addEventListener('touchmove', drag);

			cross.addEventListener('touchmove', function(e) {
				action();
			});
			let isMoving = false;
			cross.addEventListener('mousedown', function (e) {
				startX = e.clientX;
				startY = e.clientY;
				isMoving = true;
			});
			cross.addEventListener('mouseup', function (e) {
				isMoving = false;
				action();
			});
			cross.addEventListener('mousemove', function (e) {
				if (!isMoving) {
					return;
				}
				e.preventDefault();

				var deltaX = e.clientX - startX;
				var deltaY = e.clientY - startY;
				var angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
				// var length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

				// Set rotation angle for the cross arms
				var horizontal = document.querySelector('.horizontal');
				var vertical = document.querySelector('.vertical');

				horizontal.style.transform = 'rotate(' + (angle + startAngle) + 'deg)';
				vertical.style.transform = 'rotate(' + (angle + startAngle + 180) + 'deg)';

				// Move the arms to the new position based on touch length
				//  horizontal.style.width = length + 'px';
				// vertical.style.height = length + 'px';
				startAngle = angle;
			});

			function dragStart(e) {
				var touch = e.touches[0];
				startX = touch.clientX;
				startY = touch.clientY;
			}

			function drag(e) {
				e.preventDefault();
				var touch = e.touches[0];
				var deltaX = touch.clientX - startX;
				var deltaY = touch.clientY - startY;
				var angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
				// var length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

				// Set rotation angle for the cross arms
				var horizontal = document.querySelector('.horizontal');
				var vertical = document.querySelector('.vertical');

				horizontal.style.transform = 'rotate(' + angle + 'deg)';
				vertical.style.transform = 'rotate(' + (angle + 180) + 'deg)';

				// Move the arms to the new position based on touch length
				//  horizontal.style.width = length + 'px';
				// vertical.style.height = length + 'px';
			}
		},
	};
})();

//usage:
//CrossControl.init('cross-control-container');
export default CrossControl;
