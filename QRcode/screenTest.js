import pixelmatch from './libs/pixelmatch.js';

const codeDiv = document.getElementById('code');

export default async function compareImages() {
	const width = 256;
	const height = 256;

	const diffCanvas = document.getElementById('diff');
	const diffCtx = diffCanvas.getContext('2d');
	diffCanvas.width = width;
	diffCanvas.height = height;

	const exampleImg = document.getElementById('example');
	const actualImg = await createActualImg();

	const actualData = getImageData(actualImg, width, height);
	const exampleData = getImageData(exampleImg, width, height);
	const diffData = diffCtx.createImageData(width, height);

	pixelmatch(exampleData.data, actualData.data, diffData.data, width, height, {
		threshold: 0.1,
	});

	diffCtx.putImageData(diffData, 0, 0);
}

function createActualImg() {
	return htmlToImage.toPng(codeDiv).then((dataUrl) => {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.src = dataUrl;
		});
	});
}

function getImageData(img, width, height) {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, width, height);
	return ctx.getImageData(0, 0, width, height);
}
