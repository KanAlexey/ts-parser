import { Application } from 'express';
import { FeedbackService } from './services/feedback.service';

export class Controller {
  private feedbackService: FeedbackService;

  constructor(private app: Application) {
    this.feedbackService = new FeedbackService();
    this.routes();
  }

  public routes() {
    this.app.route("/feedbacks").post(this.feedbackService.getAllFeedback);

    this.app.route("/feedback").post(this.feedbackService.addNewFeedback);
    this.app
    .route("/feedback/:id")
    .delete(this.feedbackService.deleteFeedback)
    .put(this.feedbackService.updateFeedback);
  }
}