import { Component, OnInit, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AddTaskBoardDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    SidebarComponent,
    MatDialogModule,
    CommonModule,
    MatSnackBarModule,
    AddTaskBoardDialogComponent,
    FormsModule,
  ],
  template: `
    <div class="app-container">
      <app-sidebar></app-sidebar>
      <div class="main-content">
      
        <div class="header">
          <h1 class="header-text">Hello {{ userProfile?.userName }}</h1>
          <p>You have {{ projects.length }} projects assigned. Keep up the good work!</p>
        </div>

        <div class="project-info">
          <h2>
            Project
            <select [(ngModel)]="selectedProject" (change)="onProjectChange($event)">
              <option value="all">All Projects</option>
              <option *ngFor="let project of projects" [value]="project.name">
                {{ project.name }}
              </option>
            </select>
          </h2>
          <div class="status-container">
            <div class="status">
              <div class="circle red"></div>
              <span>Bugs</span>
            </div>
            <div class="status">
              <div class="circle violet"></div>
              <span>Backend</span>
            </div>
            <div class="status">
              <div class="circle blue"></div>
              <span>Frontend</span>
            </div>
            <div class="status">
              <div class="circle green"></div>
              <span>Inspection</span>
            </div>
          </div>
        </div>

        <div class="task-sections">
          <div class="task-section" *ngFor="let taskSection of taskSections">
            <h3>
              {{ taskSection.title }}
              <button (click)="addCard(taskSection.title)">+</button>
            </h3>
            <div
              *ngFor="let task of taskSection.tasks"
              [ngClass]="{
                'task-box': true,
                red: task.type === 'Bug',
                violet: task.type === 'Backend',
                blue: task.type === 'Frontend',
                green: task.type === 'Inspection'
              }"
            >
              <p>{{ task.subject }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./task-board.component.css'],
})
export class TaskBoardComponent implements OnInit {
  userProfile: any = {};
  selectedProject: string = 'all'; 
  projects: any[] = [];
  taskSections: any[] = [
    { title: 'To Do', tasks: [] },
    { title: 'In Progress', tasks: [] },
    { title: 'Review', tasks: [] },
    { title: 'Done', tasks: [] },
  ];

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private http = inject(HttpClient);
  private sessionService = inject(SessionService);
  private router = inject(Router); 

  private apiUrl = 'http://localhost:8080/api/projects'; 
  private taskApiUrl = 'http://localhost:8080/api/tasks'; 

  ngOnInit(): void {
    this.userProfile = this.sessionService.getSession(); // Get user session data
    this.fetchProjects();
    this.fetchTasks(); 
  }

  fetchProjects(): void {
    const session = this.sessionService.getSession();
    if (session) {
      const userId = session.userId;

      this.http.get<any[]>(`${this.apiUrl}/${userId}`, {
        withCredentials: true
      }).subscribe({
        next: (res) => {
          console.log('Projects fetched successfully', res);
          this.projects = res;
        },
        error: (err) => {
          console.error('Error fetching projects', err);
        }
      });
    } else {
      console.error('User is not logged in');
    }
  }

  fetchTasks(): void {
    this.http.get<any[]>(this.taskApiUrl, {
      withCredentials: true
    }).subscribe({
      next: (res) => {
        console.log('Tasks fetched successfully', res);
        this.taskSections = res.map(task => ({
          title: task.status,
          tasks: task.tasks
        }));
      },
      error: (err) => {
        console.error('Error fetching tasks', err);
      }
    });
  }

  onProjectChange(event: any): void {
    if (this.selectedProject === 'all') {
      this.fetchTasks(); 
    } else {
      const selected = this.projects.find(project => project.name === this.selectedProject);
      this.taskSections = selected ? JSON.parse(JSON.stringify(selected.tasks)) : [
        { title: 'To Do', tasks: [] },
        { title: 'In Progress', tasks: [] },
        { title: 'Review', tasks: [] },
        { title: 'Done', tasks: [] },
      ];
    }
  }

  addCard(status: string): void {
    if (this.selectedProject === 'all') {
      this.snackBar.open('Please select a specific project to add tasks.', 'Close', { duration: 2000 });
      return;
    }
  
    const selectedProject = this.projects.find(project => project.name === this.selectedProject);
    if (!selectedProject) {
      this.snackBar.open('Please select a valid project.', 'Close', { duration: 2000 });
      return;
    }
  
    const dialogRef = this.dialog.open(AddTaskBoardDialogComponent, {
      width: '500px',
      data: { status, projectId: selectedProject.id }, // Pass projectId
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const taskSection = this.taskSections.find((section) => section.title === status);
        if (taskSection) {
          taskSection.tasks.push({ ...result, type: result.category });
          const project = this.projects.find(p => p.name === this.selectedProject);
          if (project) {
            const projectTaskSection = project.tasks.find((section: { title: string; }) => section.title === status);
            projectTaskSection.tasks.push({ ...result, type: result.category });
          }
        }
        this.snackBar.open('Task Added Successfully!', 'Close', { duration: 2000 });
      }
    });
  }
  
}
