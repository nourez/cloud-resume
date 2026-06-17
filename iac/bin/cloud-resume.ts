#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { CloudResumeStack } from '../lib/cloud-resume-stack.js';

const app = new cdk.App();
new CloudResumeStack(app, 'CloudResumeStack', {});
