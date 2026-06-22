"use client";
import React from "react";
import { Progress, Button } from "antd";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import congratulations from "../../../assets/images/congratulations.png";
import { useRouter } from "next/navigation";
import StepProfessionalInfo from "./ProviderProfileSetupHooks/StepProfessionalInfo";
import StepDocuments from "./ProviderProfileSetupHooks/StepDocuments";
import StepSchedule from "./ProviderProfileSetupHooks/StepSchedule";
import StepPreferences from "./ProviderProfileSetupHooks/StepPreferences";
import ProviderDateTimeAddEdit from "./Provider-DateTime";
import SubmitSuccessModal from "./ProviderProfileSetupHooks/SubmitSuccessModal";
import useProviderProfile from "./ProviderProfileSetupHooks/useProviderProfile";

function ProviderProfileSetUp() {
  const { credential, progressValue, form, ui, handlers, scheduleModalProps } =
    useProviderProfile();

  const router = useRouter();
  const handleHomePage = () => router.push("/");

  const renderStepContent = () => {
    switch (credential) {
      case "Professional Info":
        return (
          <StepProfessionalInfo
            form={form}
            initialValues={ui.initialProfessional}
            onNext={handlers.handleProfileSatUpStepOne}
          />
        );
      case "Documents":
        return (
          <StepDocuments
            fileList={ui.fileList}
            setFileList={handlers.setFileList}
            onNext={handlers.handleDocumentUpload}
          />
        );
      case "Schedule":
        return (
          <StepSchedule
            schedule={ui.schedule}
            selectedDate={ui.selectedDate}
            setSelectedDate={handlers.setSelectedDate}
            toggleAvailability={handlers.toggleAvailability}
            setEditingDayIndex={handlers.setEditingDayIndex}
            setShowTimePicker={handlers.setShowTimePicker}
            onNext={handlers.handleSchedule}
          />
        );
      case "Preferences":
        return (
          <StepPreferences
            form={form}
            experience={ui.experience}
            setExperience={handlers.setExperience}
            stepsCount={ui.stepsCount}
            setStepsCount={handlers.setStepsCount}
            onChangeCallRequest={handlers.setOnChange}
            onSubmit={handlers.handleProfileSatUpStepTow}
            agreeToTamsPolice={ui.agreeToTamsPolice}
            setAgreeToTamsPolice={handlers.setAgreeToTamsPolice}
            updating={ui.updating}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center px-4 py-8 md:py-12">
      <div className="max-w-md w-full text-center space-y-5 md:px-4">
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold text-gray-700 text-left">
            {credential}
          </h1>
          <div>
            <h1 className="text-gray-600 text-left">
              Step {progressValue} of 4
            </h1>
            <Progress percent={(progressValue / 4) * 100} showInfo={false} />
          </div>
        </div>

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {ui.canGoBack && (
            <Button
              type="default"
              size="large"
              onClick={handlers.goToPreviousStep}
              className="flex-1"
              style={{
                borderColor: "#d9d9d9",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              <ArrowLeft className="mr-2" size={16} />
              Back
            </Button>
          )}

          {/* For steps with their own next buttons, we don't show the generic next button */}
          {credential !== "Professional Info" &&
            credential !== "Preferences" &&
            ui.canGoNext && (
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  if (credential === "Documents")
                    handlers.handleDocumentUpload();
                  if (credential === "Schedule") handlers.handleSchedule();
                }}
                className="flex-1"
                style={{
                  backgroundColor: "#14b8a6",
                  borderColor: "#14b8a6",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Next
                <ArrowRight className="ml-2" size={16} />
              </Button>
            )}
        </div>
      </div>

      <ProviderDateTimeAddEdit {...scheduleModalProps} />

      <SubmitSuccessModal
        open={ui.submitMessage}
        onClose={handlers.closeSubmitMessage}
        onGoHome={handleHomePage}
      />
    </div>
  );
}

export default ProviderProfileSetUp;
