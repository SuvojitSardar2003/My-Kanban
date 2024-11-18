# Kanban_Flow_Infosys_Internship_Oct2024
Simple Kanban Board for Task Management. Create a Kanban board for individual and team task management, allowing users to organize members into teams and manage tasks in different stages (To Do, In Progress, Review, Done) and visualize workflow.

# Table of Contents
- [Introduction]
- [Prerequisites]
- [Backend Setup]
- [Frontend Setup]
- [Running the Project]
- [Additional Information]

# Introduction
This project is a Kanban Flow application split into backend and frontend sections. The backend is developed using Spring Boot, while the frontend is built using Angular.

# Prerequisites
Before you begin, ensure you have the following installed on your local machine:
- **Node.js**: [Download Node.js](https://nodejs.org/)
- **Java Development Kit (JDK)**: Version 11 or later [Download JDK](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- **Apache Maven**: [Download Maven](https://maven.apache.org/download.cgi)
- **Angular CLI**: Install globally using `npm install -g @angular/cli`

# Backend Setup

1. **Clone the Repository**:
   
    git clone https://github.com/SpringBoardMentor115/Kanban_Flow_Infosys_Internship_Oct2024.git
    cd kanban-flow/backend
    

2. **Configure Database**:
    - Update the `src/main/resources/application.properties` file with your database configuration:
      properties
      spring.datasource.url=jdbc:mysql://localhost:3306/yourdatabase
      spring.datasource.username=yourusername
      spring.datasource.password=yourpassword
      spring.jpa.hibernate.ddl-auto=update
      

3. **Build the Backend**:
    
    mvn clean install
   

4. **Run the Backend**:
    
    mvn spring-boot:run
    

## Frontend Setup

1. **Navigate to Frontend Directory**:
    
    cd ../frontend
    

2. **Install Dependencies**:
    
    npm install
    

3. **Run the Frontend**:
   
    ng serve 
    

# Running the Project

## Start Backend
Ensure your backend is running by navigating to the `backend` directory and using Maven to run the Spring Boot application:

cd backend
mvn spring-boot:run

## Run the Frontend
   
ng serve

# Access the Application
Open your web browser and navigate to:

Frontend: http://localhost:4200

Backend: http://localhost:8080
