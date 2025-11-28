# Firma

Firma is a simple, in-browser PDF editor that allows you to add text fields to your PDF documents. It's built with React, Vite, and pdf-lib, and it runs entirely in your browser, so your files are never uploaded to a server.

## Features

-   **Choose a PDF**: Choose a PDF file from your computer to start editing.
-   **Add Text Fields**: Click the "Add Text Field" button to add a new text field to your document.
-   **Drag and Drop**: Move text fields around the document by dragging and dropping them.
-   **Edit Text**: Click on a text field to edit the text inside it.
-   **Download PDF**: Download your edited PDF with the text fields you added.

## Tech Stack

-   **React**: A JavaScript library for building user interfaces.
-   **Vite**: A fast build tool for modern web projects.
-   **pdf-lib**: A JavaScript library for creating and modifying PDF documents.
-   **react-pdf**: A React component for displaying PDFs.
-   **react-draggable**: A React component for making elements draggable.
-   **Tailwind CSS**: A utility-first CSS framework for styling.

## How to Run

1.  Clone the repository.
2.  Install dependencies with `pnpm install`.
3.  Start the development server with `pnpm dev`.
4.  Open your browser to `http://localhost:5173`.

## How it Works

Firma uses `react-pdf` to render the PDF in the browser. When you choose a PDF, it's read as a data URL and passed to the `Document` component from `react-pdf`.

Text fields are managed in the React state. When you add a new text field, it's added to an array of text fields in the state. Each text field has an ID, text content, and x/y coordinates.

`react-draggable` is used to make the text fields draggable. When you drag a text field, its x/y coordinates are updated in the state.

When you download the PDF, `pdf-lib` is used to add the text fields to the PDF. The text fields are drawn directly onto the PDF page using the coordinates from the state. The resulting PDF is then downloaded to your computer.

## Future Features

-   **Configuration**: Add a screen to configure static fields like name and company.
-   **Date Formats**: When a date field is selected, show options for formatting in the sidebar.
-   **Signature Fields**: Add signature fields to your PDF documents.
-   **Image Fields**: Add image fields to your PDF documents.
-   **Watermarker**: Add a watermarker to your PDF documents.
-   **Stamp Fields**: Add stamp fields to your PDF documents.