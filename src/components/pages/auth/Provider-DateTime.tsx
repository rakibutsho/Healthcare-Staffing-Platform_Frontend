"use client";
import { Button, Form, Modal, TimePicker } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";

interface TimePickerProps {
  showTimePicker: boolean;
  setShowTimePicker: (value: boolean) => void;
  editingDayIndex: number | null;
  setEditingDayIndex: (value: number | null) => void;
  editingIndex: number | null;
  onSaveTimes: (index: number, startTime: string, endTime: string) => void;
}

interface FormValues {
  start_time: dayjs.Dayjs;
  end_time: dayjs.Dayjs;
}

function ProviderDateTimeAddEdit({
  showTimePicker,
  setShowTimePicker,
  editingDayIndex,
  setEditingDayIndex,
  editingIndex,
  onSaveTimes,
}: TimePickerProps) {
  const [form] = Form.useForm();

  // useEffect(() => {
  //   if (scheduleItem && scheduleItem.startTime && scheduleItem.endTime) {
  //     form.setFieldsValue({
  //       start_time: dayjs(scheduleItem.startTime, "hh:mm A"),
  //       end_time: dayjs(scheduleItem.endTime, "hh:mm A"),
  //     });
  //   } else {
  //     form.setFieldsValue({
  //       start_time: dayjs("09:00 AM", "hh:mm A"),
  //       end_time: dayjs("05:00 PM", "hh:mm A"),
  //     });
  //   }
  // }, [scheduleItem, form]);

  const handleUpdatedProfile = (values: FormValues) => {
    const startTime = values.start_time.format("hh:mm A");
    const endTime = values.end_time.format("hh:mm A");

    // Validate time order
    if (!values.end_time.isAfter(values.start_time)) {
      Modal.error({
        title: "Invalid Time Selection",
        content: "End time must be after start time. Please select valid times.",
      });
      return;
    }

    if (editingIndex !== null && typeof editingIndex === "number") {
      onSaveTimes(editingIndex, startTime, endTime);
    }

    setShowTimePicker(false);
    setEditingDayIndex(null);
    form.resetFields();
  };

  const handleCancel = () => {
    setShowTimePicker(false);
    setEditingDayIndex(null);
    form.resetFields();
  };

  return (
    <Modal
      open={showTimePicker}
      onCancel={handleCancel}
      footer={null}
      centered
      title={editingDayIndex !== null ? "Edit Availability" : "Add Availability"}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdatedProfile}
        className="space-y-4"
      >
        <Form.Item
          label="Start Time"
          name="start_time"
          rules={[{ required: true, message: "Please select start time" }]}
        >
          <TimePicker 
            use12Hours 
            format="hh:mm A" 
            className="w-full h-12" 
            minuteStep={15}
          />
        </Form.Item>

        <Form.Item
          label="End Time"
          name="end_time"
          rules={[{ 
            required: true, 
            message: "Please select end time" 
          }]}
        >
          <TimePicker 
            use12Hours 
            format="hh:mm A" 
            className="w-full h-12" 
            minuteStep={15}
          />
        </Form.Item>

        <div className="flex gap-4 justify-end mt-4">
          <Button
            size="large"
            onClick={handleCancel}
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
            Save Times
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default ProviderDateTimeAddEdit;