import React, { useState, useEffect, useRef } from "react";

// styles object
const styles = {
	gridContainer: {
		maxWidth: "1200px",
		margin: "0 auto",
		padding: "20px",
	},
	grid: {
		display: "grid",
		gridTemplateColumns: "repeat(3, 1fr)",
		gap: "20px",
		gridAutoRows: "auto",
	},
	card: {
		cursor: "move",
		transition: "transform 0.2s",
		userSelect: "none",
	},
	cardDragging: {
		opacity: 0.5,
	},
	cardHover: {
		transform: "scale(1.05)",
	},
	imageContainer: {
		position: "relative",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "200px",
		backgroundColor: "#f0f0f0",
	},
	image: {
		maxWidth: "100%",
		maxHeight: "250px",
		objectFit: "cover",
		cursor: "move",
	},
	spinner: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "50px",
		height: "50px",
	},
	spinnerInner: {
		width: "30px",
		height: "30px",
		border: "3px solid #f3f3f3",
		borderTop: "3px solid #3498db",
		borderRadius: "50%",
		animation: "spin 1s linear infinite",
	},
	modalOverlay: {
		position: "fixed",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0,0,0,0.7)",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1000,
	},
	modalContent: {
		maxWidth: "90%",
		maxHeight: "90%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	fullImage: {
		maxWidth: "100%",
		maxHeight: "80vh",
		objectFit: "contain",
	},
};

// Thumbnails mapping
const thumbnails = {
	"bank-draft":
		"https://fastly.picsum.photos/id/152/3888/2592.jpg?hmac=M1xv1MzO9xjf5-tz1hGR9bQpNt973ANkqfEVDW0-WYU",
	"bill-of-lading":
		"https://fastly.picsum.photos/id/12/3888/2592.jpg?hmac=z5QnvAxvFWTEDcrH9g34B5whrOlRpoyRMaX-wJpT9h0",
	invoice:
		"https://fastly.picsum.photos/id/52/3888/2592.jpg?hmac=RwCeYpUEmU7f7bmIMWYRDrujFc8MqTHcUQmgztI5jnU",
	"bank-draft-2":
		"https://fastly.picsum.photos/id/11/3888/2592.jpg?hmac=dkM-BSWi2m7YAH3n-fvvXSzUS4k668DYPBZ6UVoJN10",
	"bill-of-lading-2":
		"https://fastly.picsum.photos/id/2/3888/2592.jpg?hmac=H2kj1bNmSkXNECY4B4sHjQzZVa05ruYwqevOOYs4Q8A",
};

function DocumentGrid() {
	const [documents, setDocuments] = useState([]);
	const [selectedDocument, setSelectedDocument] = useState(null);
	const [imageLoading, setImageLoading] = useState({});
	const [draggedItem, setDraggedItem] = useState(null);

	const dragItem = useRef(null);
	const dragOverItem = useRef(null);

	useEffect(() => {
		fetch("/api/documents")
			.then((res) => res.json())
			.then((data) => setDocuments(data));
		// Preload images
		Object.values(thumbnails).forEach((url) => {
			const img = new Image();
			img.src = url;
		});
	}, []);

	const handleDragStart = (e, position) => {
		dragItem.current = position;
		e.dataTransfer.effectAllowed = "move";
		setDraggedItem(documents[position]);
	};

	const handleDragEnter = (position) => {
		dragOverItem.current = position;
	};

	const handleDragEnd = () => {
		const newDocuments = [...documents];
		const draggedItemContent = newDocuments[dragItem.current];

		// Remove dragged item from original position
		newDocuments.splice(dragItem.current, 1);

		// Insert dragged item at new position
		newDocuments.splice(dragOverItem.current, 0, draggedItemContent);

		// Reset references
		dragItem.current = null;
		dragOverItem.current = null;

		// Update positions
		const updatedDocuments = newDocuments.map((doc, index) => ({
			...doc,
			position: index,
		}));

		localStorage.setItem("updatedDocumentSequence", JSON.stringify(updatedDocuments));
		console.log(updatedDocuments, "updatedDocuments");

		setDocuments(updatedDocuments);
		setDraggedItem(null);
	};

	const handleImageLoad = (type) => {
		setImageLoading((prev) => ({ ...prev, [type]: false }));
	};

	const handleImageError = (type) => {
		setImageLoading((prev) => ({ ...prev, [type]: false }));
	};

	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				setSelectedDocument(null);
			}
		};

		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, []);

	return (
		<div style={styles.gridContainer}>
			<div style={styles.grid}>
				{documents.map((doc, index) => (
					<div
						key={doc.type}
						style={{
							...styles.card,
							...(draggedItem === doc ? styles.cardDragging : {}),
							":hover": styles.cardHover,
						}}
						draggable
						onDragStart={(e) => handleDragStart(e, index)}
						onDragEnter={() => handleDragEnter(index)}
						onDragOver={(e) => e.preventDefault()}
						onDragEnd={handleDragEnd}
						onClick={() => setSelectedDocument(doc)}
					>
						<div>
							<div style={styles.imageContainer}>
								{imageLoading[doc.type] !== false && (
									<div style={styles.spinner}>
										<div style={styles.spinnerInner}></div>
									</div>
								)}
								<img
									src={thumbnails[doc.type]}
									alt={doc.title}
									style={{
										...styles.image,
										display:
											imageLoading[doc.type] === false ? "block" : "none",
									}}
									onLoad={() => handleImageLoad(doc.type)}
									onError={() => handleImageError(doc.type)}
								/>
							</div>
							<div style={{ padding: "15px", textAlign: "center" }}>
								<h3 style={{ margin: 0, fontSize: "1rem" }}>{doc.title}</h3>
							</div>
						</div>
					</div>
				))}
			</div>

			{selectedDocument && (
				<div
					style={styles.modalOverlay}
					onClick={() => setSelectedDocument(null)}
				>
					<div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
						<img
							src={thumbnails[selectedDocument.type]}
							alt={selectedDocument.title}
							style={styles.fullImage}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default DocumentGrid;
