import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

export class CloudResumeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // TODO: Add S3, CloudFront, and Lambda resources for frontend and API hosting.
  }
}
