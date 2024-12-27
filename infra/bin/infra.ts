#!/usr/bin/env node

import { App, Stage } from "aws-cdk-lib";
import { DEPLOYMENT_STAGES, InfraStack } from "../lib/infra-stack";

const app = new App();

const stageName = app.node.tryGetContext("stage");
if (stageName == undefined || stageName === "") {
  throw new Error(
    "Context argument 'stage' must be provided to CDK command, " +
    "please add \"--context stage=<STAGE>\" to the CDK CLI command",
  );
}

const supportedStageNames = Object.keys(DEPLOYMENT_STAGES);
if (!supportedStageNames.includes(stageName)) {
  throw new Error(
    "Argument provided for 'stage' was not one of the supported stages. " +
      `Provided: ${stageName}, supported stages: [${supportedStageNames}]`,
  );
}
const stageConfig = DEPLOYMENT_STAGES[stageName];

const deploymentStage = new Stage(app, stageName, {
  env: { account: stageConfig.accountId, region: stageConfig.region },
  stageName,
});

new InfraStack(deploymentStage, "SecureCloudFilesInfrastructure", {
  description: "Infrastructure for the Secure Cloud Files site",
  stageName,
  stageConfig,
});
