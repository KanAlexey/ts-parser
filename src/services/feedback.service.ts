import { Request, Response } from "express";
import { MongooseDocument } from 'mongoose';
import { Feedback } from '../models/feedback.model';
import { getSortingObject, getFilterObject } from "../helper/feedback.helper";

export class FeedbackService {
  constructor() {
  }
  public getAllFeedback(req: Request, res: Response) {
    // pagination
    const size = Number(req.query.size);
    const offset = Number(req.query.offset);
    // sorting
    const { sortInfo, filter } = req.body;
    const sort: { [key: string]: number } = getSortingObject(sortInfo)
    // filtering
    const query: { [key: string]: string | { $lte: string } } = getFilterObject(filter);
  
    Feedback.find(query).skip(offset).limit(size).sort(sort).exec((error: Error, feedback: MongooseDocument) => {
      if (error) {
        res.send(error);
      }
      res.json(feedback);
    });
  }

    // The other crud

    public addNewFeedback(req: Request, res: Response) {
      const newFeedback = new Feedback(req.body);
      newFeedback.save((error: Error, feedback: MongooseDocument) => {
        if (error) {
          res.send(error);
        }
        res.json(feedback);
      });
    }

    public deleteFeedback(req: Request, res: Response) {
      const feedbackId = req.params.id;
      Feedback.findByIdAndDelete(feedbackId, (error: Error, deleted: any) => {
        if (error) {
          res.send(error);
        }
        const message = deleted ? 'Deleted successfully' : 'Feedback not found :(';
        res.send(message);
      });
    }

    public updateFeedback(req: Request, res: Response) {
      const feedbackId = req.params.id;
      Feedback.findByIdAndUpdate(
        feedbackId,
        req.body,
        (error: Error, feedback: any) => {
          if (error) {
            res.send(error);
          }
          const message = feedback
            ? 'Updated successfully'
            : 'Feedback not found :(';
          res.send(message);
        }
      );
    }
}