import AddressAutocomplete from "@/components/shared/AddressAutocomplete";
import { Button, Checkbox, Form, Input, Select } from "antd";
import { ArrowRight } from "lucide-react";
import { STATE_OPTIONS } from "./stateLicences";

const EXPERIENCE_OPTIONS = [
  { label: "1-2 Years", value: "ONE_TO_TWO_YEARS" },
  { label: "2-3 Years", value: "TWO_TO_THREE_YEARS" },
  { label: "3-4 Years", value: "THREE_TO_FOUR_YEARS" },
  { label: "4-10 Years", value: "FOUR_TO_TEN_YEARS" },
];

export default function StepProfessionalInfo({
  form,
  initialValues,
  onNext,
}: {
  form: any;
  initialValues: any;
  onNext: (v: any) => void;
}) {
  // Sync experience when form changes
  const handleValuesChange = (changedValues: any) => {
    if (changedValues.experience !== undefined) {
      // The experience will be handled in the parent hook
      form.setFieldsValue({ experience: changedValues.experience });
    }
  };

  return (
    <Form
      form={form}
      onFinish={onNext}
      onValuesChange={handleValuesChange}
      layout="vertical"
      className="w-full text-left space-y-4"
      initialValues={initialValues}
    >
      {/* Providers */}
      <Form.Item
        name="provider"
        label="Providers"
        rules={[{ required: true, message: "Please select a provider!" }]}
      >
        <Checkbox.Group
          style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}
        >
          <Checkbox value="CRNA">CRNA</Checkbox>
          <Checkbox value="AA">AA</Checkbox>
          <Checkbox value="MD/DO">MD/DO</Checkbox>
        </Checkbox.Group>
      </Form.Item>

      {/* Certifications */}
      <Form.Item
        name="certification"
        label="Certifications"
        rules={[{ required: true, message: "Please provide certifications!" }]}
      >
        <Checkbox.Group
          style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
        >
          <Checkbox value="BLS">BLS</Checkbox>
          <Checkbox value="ACLS">ACLS</Checkbox>
          <Checkbox value="PALS">PALS</Checkbox>
          <Checkbox value="DIPLOMA">Diploma</Checkbox>
          <Checkbox value="LICENCE">Licence</Checkbox>
        </Checkbox.Group>
      </Form.Item>

      {/* NPI & License */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3">
        <Form.Item
          label="NPI Number"
          name="nip_number"
          rules={[{ required: true, message: "Please enter your NPI number!" }]}
        >
          <Input placeholder="Enter NPI number" size="large" className="h-12" />
        </Form.Item>

        <Form.Item
          label="License Number(s)"
          name="license_number"
          rules={[{ required: true, message: "Please enter license number!" }]}
        >
          <Input
            placeholder="Enter license number"
            size="large"
            className="h-12"
          />
        </Form.Item>
      </div>

      {/* Phone & Address */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3">
        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ required: true, message: "Please enter phone number!" }]}
        >
          <Input
            placeholder="Enter phone number"
            size="large"
            className="h-12"
          />
        </Form.Item>

        <Form.Item
          label="Full Address"
          name="fullAddress"
          rules={[
            { required: true, message: "Please enter your full address!" },
          ]}
        >
          <AddressAutocomplete
            placeholder="Enter full address"
            onChange={(v: string) => form.setFieldsValue({ fullAddress: v })}
            onSelect={(address: string) =>
              form.setFieldsValue({ fullAddress: address })
            }
          />
        </Form.Item>
      </div>

      {/* Experience & States */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3">
        <Form.Item
          label="Experience"
          name="experience"
          rules={[
            { required: true, message: "Please select your experience!" },
          ]}
        >
          <Select
            placeholder="Select experience"
            size="large"
            onChange={(value) => {
              form.setFieldsValue({ experience: value });
            }}
          >
            {EXPERIENCE_OPTIONS.map((o) => (
              <Select.Option key={o.value} value={o.value}>
                {o.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="State(s) Licensed"
          name="state_licensed"
          rules={[
            { required: true, message: "Please select states licensed!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select state(s)"
            options={STATE_OPTIONS}
            style={{ width: "100%" }}
            maxTagCount={3}
            showSearch
            optionFilterProp="label"
            dropdownStyle={{ maxHeight: 250, overflowY: "auto" }}
          />
        </Form.Item>
      </div>

      {/* Submit */}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          style={{
            backgroundColor: "#14b8a6",
            borderColor: "#14b8a6",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Next <ArrowRight />
        </Button>
      </Form.Item>
    </Form>
  );
}
