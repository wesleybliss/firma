# Firma: In-Browser PDF Editor

Firma is a lightweight, client-side web application that allows users to fill and sign PDF documents directly in their browser. It provides a simple, intuitive interface for adding and manipulating text fields on a PDF, with no server-side processing required.

## Core Functionality

The application is built as a single-page React application and leverages modern web technologies to deliver a seamless user experience.

-   **PDF Upload and Rendering**: Users can upload a PDF document from their local machine. The document is then rendered directly in the browser using `react-pdf`, which provides high-fidelity display of PDF content.

-   **Dynamic Text Fields**: Users can add editable text fields to the PDF. These fields can be positioned anywhere on the document via a simple drag-and-drop interface, powered by `react-draggable`.

-   **Client-Side PDF Modification**: When a user adds text, the application uses the `pdf-lib` library to modify the PDF document in memory. The text is drawn directly onto the PDF page, ensuring that the output is a standard, flattened PDF.

-   **Download and Save**: Once editing is complete, users can download the modified PDF. The new document is generated entirely on the client-side, ensuring user privacy and eliminating the need for server infrastructure.

## Technical Architecture

The project follows a standard frontend architecture, with a focus on modularity and type safety.

-   **Framework**: The core of the application is built with React and TypeScript, providing a robust and maintainable codebase.

-   **State Management**: Component-level state is managed using React hooks (`useState`, `useRef`), which store the PDF file, page information, and the state of each text field (content, position).

-   **Styling**: The user interface is styled with Tailwind CSS, a utility-first CSS framework that allows for rapid and consistent UI development.

-   **Key Libraries**:
    -   `react-pdf`: Renders PDF documents within the React application.
    -   `pdf-lib`: A comprehensive library for creating and modifying PDF documents with JavaScript.
    -   `react-draggable`: Enables drag-and-drop functionality for text fields.
    -   `lucide-react`: Provides a lightweight and customizable icon set.

## Agent Interaction Guide

As an AI agent, you can interact with and modify this project in the following ways:

-   **Adding New Features**: You can extend the application's functionality by adding new features, such as:
    -   Support for multiple pages.
    -   Different types of form fields (e.g., checkboxes, signatures).
    -   Customizable text properties (font size, color).

-   **Improving User Experience**: You can enhance the UI/UX by:
    -   Implementing a zoom and pan feature for better navigation of large documents.
    -   Adding a toolbar for text formatting options.
    -   Improving the visual feedback during drag-and-drop operations.

-   **Code Refactoring and Maintenance**: You can help maintain the codebase by:
    -   Refactoring components for better readability and performance.
    -   Upgrading dependencies and resolving any compatibility issues.
    -   Adding unit or integration tests to ensure code quality.

When making changes, please adhere to the existing coding style and conventions. All logic is contained within the `src/App.tsx` component, which serves as the main entry point for the application's functionality.
