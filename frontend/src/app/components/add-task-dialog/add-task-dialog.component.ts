import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Correct import
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-add-task-board-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
  ],
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css'],
})
export class AddTaskBoardDialogComponent implements OnInit {
  newTask = {
    projectId: null,
    assignedToId: null as number | null, // Update the type here
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    category: '',
    status: 'TODO'
  };
  teamMembers: any[] = [];
  projects: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddTaskBoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Directly using data object
    private http: HttpClient, // Inject HttpClient
    private router: Router, // Inject Router
    private sessionService: SessionService // Inject SessionService
  ) {}

  ngOnInit(): void {
    this.newTask.projectId = this.data.projectId; // Ensure projectId is assigned

    this.fetchProjects();
    this.setInitialStatus();
  }

  fetchProjects(): void {
    const session = this.sessionService.getSession();
    if (session) {
      const userId = session.userId;

      this.http.get<any[]>(`http://localhost:8080/api/projects/${userId}`)
        .subscribe(
          projects => {
            this.projects = projects;
            this.fetchTeamMembers();
          },
          error => {
            console.error('Error fetching projects:', error);
          }
        );
    } else {
      console.error('User is not logged in');
    }
  }

  fetchTeamMembers(): void {
    const selectedProject = this.projects.find(project => project.id === this.newTask.projectId);
    if (selectedProject) {
      this.teamMembers = selectedProject.teamMembers;
    } else {
      console.error('Project not found');
    }
  }

  setInitialStatus(): void {
    switch (this.data.status) {
      case 'To Do':
        this.newTask.status = 'TODO';
        break;
      case 'In Progress':
        this.newTask.status = 'IN_PROGRESS';
        break;
      case 'In Review':
        this.newTask.status = 'IN_REVIEW';
        break;
      case 'Done':
        this.newTask.status = 'DONE';
        break;
      default:
        this.newTask.status = 'TODO';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitTask(): void {
    if (this.isFormValid()) {
      const httpOptions = {
        withCredentials: true
      };
      // Convert assignedToId to number
      this.newTask.assignedToId = Number(this.newTask.assignedToId);

      // Map priority values to match backend API
      this.newTask.priority = this.newTask.priority.toUpperCase();
      // Use let instead of const
    let date = new Date(this.newTask.dueDate);
    
    // If just a date is provided, set time to end of day
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      date = new Date(this.newTask.dueDate + 'T23:59:59');
    }
    
    // Convert to ISO string and trim to match backend expectation
    this.newTask.dueDate = date.toISOString().slice(0, 19);

      // Ensure projectId is included
      const taskPayload = { ...this.newTask };

      console.log('Submitting Task:', taskPayload); // Log the payload

      this.http.post('http://localhost:8080/api/tasks', taskPayload).subscribe(
        response => {
          console.log('Task submitted successfully:', response);
          this.dialogRef.close(response);
        },
        error => {
          console.error('Error submitting task:', error);
        }
      );
    } else {
      alert('Please fill in all the required fields.');
    }
  }

  isFormValid(): boolean {
    return (
      this.newTask.title !== '' &&
      this.newTask.description !== '' &&
      this.newTask.dueDate !== '' &&
      this.newTask.priority !== '' &&
      this.newTask.category !== '' &&
      this.newTask.assignedToId !== null &&
      this.newTask.status !== '' &&
      this.newTask.projectId !== null
    );
  }
}
