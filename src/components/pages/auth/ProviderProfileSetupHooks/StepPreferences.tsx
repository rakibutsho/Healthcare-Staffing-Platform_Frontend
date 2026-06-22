import React from "react";
import { Button, Checkbox, Form, Slider, Switch } from "antd";

export default function StepPreferences({
  form,
  experience,
  setExperience,
  stepsCount,
  setStepsCount,
  onChangeCallRequest,
  onSubmit,
  agreeToTamsPolice,
  setAgreeToTamsPolice,
  updating,
}: {
  form: any;
  experience: any;
  setExperience: (v: any) => void;
  stepsCount: number;
  setStepsCount: (v: number) => void;
  onChangeCallRequest: (v: boolean) => void;
  onSubmit: (v: any) => void;
  agreeToTamsPolice: boolean;
  setAgreeToTamsPolice: (v: boolean) => void;
  updating: boolean;
}) {
  const handleSubmit = async (values: any) => {
    // Ensure experience is set before submitting
    if (!experience) {
      // You might want to show an error or handle this differently
      console.error("Experience is required");
      return;
    }

    // Pass the experience along with form values
    const submitData = {
      ...values,
      experience: experience, // Make sure experience is included
    };

    onSubmit(submitData);
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      className="w-full text-left space-y-4"
    >
      <Form.Item name="mdDoCredentials" label="Case-Type Preferences">
        <Checkbox.Group className="flex flex-col gap-2">
          <Checkbox value="GENERAL">GENERAL</Checkbox>
          <Checkbox value="ORTHOPEDIC">ORTHOPEDIC</Checkbox>
          <Checkbox value="ENT">ENT</Checkbox>
          <Checkbox value="GI_OR_ENDOSCOPY">GI OR ENDOSCOPY</Checkbox>
          <Checkbox value="OB_OR_GYN">OB OR GYN</Checkbox>
          <Checkbox value="UROLOGY">UROLOGY</Checkbox>
          <Checkbox value="CARDIAC">CARDIAC</Checkbox>
          <Checkbox value="NEUROSURGERY">NEUROSURGERY</Checkbox>
          <Checkbox value="PEDIATRICS">PEDIATRICS</Checkbox>
          <Checkbox value="TRAUMA">TRAUMA</Checkbox>
          <Checkbox value="PAIN_MANAGEMENT">PAIN MANAGEMENT</Checkbox>
          <Checkbox value="OPHTHALMOLOGY">OPHTHALMOLOGY</Checkbox>
          <Checkbox value="DENTAL_OR_ORAL_SURGERY">
            DENTAL OR ORAL SURGERY
          </Checkbox>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item label="Call Willingness" style={{ fontSize: "20px" }}>
        <div className="flex items-center justify-between">
          <h1>Accept Call Requests</h1>
          <Switch
            checked={onChangeCallRequest as any}
            onChange={(v) => onChangeCallRequest(v as any)}
          />
        </div>
      </Form.Item>

      <div className="mb-4">
        <h1 className="font-medium mb-2 text-xl">
          Distance Radius{" "}
          <span className="text-gray-500 text-sm">(Kilo Meter)</span>
        </h1>
        <Slider
          min={2}
          max={100}
          value={stepsCount}
          onChange={(v) => setStepsCount(v as number)}
        />
      </div>

      <div className="pb-5">
        <Checkbox
          checked={agreeToTamsPolice}
          onChange={() => setAgreeToTamsPolice(!agreeToTamsPolice)}
        >
          I&lsquo;m agree to the <a href="#">Terms & Conditions</a> and{" "}
          <a href="#">Privacy Policy</a>
        </Checkbox>
      </div>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          disabled={!agreeToTamsPolice || updating || !experience}
          style={{
            backgroundColor: experience ? "#14b8a6" : "#cccccc",
            borderColor: experience ? "#14b8a6" : "#cccccc",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {updating ? "Saving..." : "Submit"}
        </Button>
        {!experience && (
          <p className="text-red-500 text-sm mt-2">
            Please go back to Professional Info step and select your experience
          </p>
        )}
      </Form.Item>
    </Form>
  );
}
