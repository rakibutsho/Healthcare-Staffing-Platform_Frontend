import { Button, Form, Modal, TimePicker } from "antd";
import type { DaySchedule } from "./MyAvailability";
import dayjs from "dayjs";
import { useEffect } from "react";

interface TimePickerProps {
  showTimePicker: boolean;
  setShowTimePicker: (value: boolean) => void;
  editingDayIndex: DaySchedule | null;
  setEditingDayIndex: (value: DaySchedule | null) => void;
  handleSubmitTime: (startTime: string, endTime: string) => void;
}

interface FormValues {
  start_time: dayjs.Dayjs;
  end_time: dayjs.Dayjs;
}

function DateTimeAddEdit({
  showTimePicker,
  setShowTimePicker,
  editingDayIndex,
  setEditingDayIndex,
  handleSubmitTime,
}: TimePickerProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingDayIndex) {
      try {
        const startTime = editingDayIndex.startTime || "09:00 AM";
        const endTime = editingDayIndex.endTime || "01:00 PM";
        
        form.setFieldsValue({
          start_time: dayjs(startTime, "hh:mm A"),
          end_time: dayjs(endTime, "hh:mm A"),
        });
      } catch (error) {
        console.error("Error parsing times:", error);
        form.setFieldsValue({
          start_time: dayjs("09:00 AM", "hh:mm A"),
          end_time: dayjs("01:00 PM", "hh:mm A"),
        });
      }
    } else {
      form.resetFields();
    }
  }, [editingDayIndex, form]);

  const onFinish = (values: FormValues) => {
    handleSubmitTime(
      values.start_time.format("hh:mm A"),
      values.end_time.format("hh:mm A")
    );
    form.resetFields();
  };

  return (
    <Modal
      open={showTimePicker}
      onCancel={() => {
        setShowTimePicker(false);
        setEditingDayIndex(null);
      }}
      footer={null}
      centered
      title={editingDayIndex ? "Edit Availability" : "Add Availability"}
      width={400}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
        <Form.Item
          label="Start Time"
          name="start_time"
          rules={[{ required: true, message: "Please enter your start time" }]}
        >
          <TimePicker use12Hours format="hh:mm A" className="w-full h-12" />
        </Form.Item>

        <Form.Item
          label="End Time"
          name="end_time"
          rules={[{ required: true, message: "Please enter your end time" }]}
        >
          <TimePicker use12Hours format="hh:mm A" className="w-full h-12" />
        </Form.Item>

        <div className="flex gap-4 justify-end mt-4">
          <Button
            size="large"
            onClick={() => {
              setShowTimePicker(false);
              form.resetFields();
            }}
            className="h-12"
            style={{ borderRadius: 8, fontSize: 14, fontWeight: 500 }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            className="h-12"
            style={{
              backgroundColor: "#14b8a6",
              borderColor: "#14b8a6",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default DateTimeAddEdit;
