import { Schema, model, Document, Types } from 'mongoose';

// Interface for the plain Project object
export interface IProject {
  name: string;
  userId: string;
  description?: string;
  primaryLanguage?: string;
  template?: string;
  files: Map<string, string>;
  metadata?: any;
}

// Interface for the Mongoose Document, which includes the _id and other Mongoose fields
export interface IProjectDocument extends IProject, Document {
  _id: Types.ObjectId;
}

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    description: String,
    primaryLanguage: String,
    template: String,
    files: { type: Map, of: String, default: {} }, // path -> content
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Project = model<IProjectDocument>('Project', ProjectSchema);