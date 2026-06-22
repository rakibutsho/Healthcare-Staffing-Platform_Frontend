/* eslint-disable react-hooks/exhaustive-deps */
import { Form } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import { useEffect, useMemo, useState, useCallback } from "react";
import dayjs from "dayjs";
import {
  useGetProviderProfileQuery,
  useUpdateProviderProfileMutation,
} from "@/redux/features/(Providers)/profileProvider/profileProviderApi";
import { toast } from "sonner";
import { buildProviderAvailability, toUpper } from "./providerProfile.utils";
import { StateLicence } from "./stateLicences";

export interface DaySchedule {
  date: string;
  dayName?: string;
  dayNumber?: number;
  available: boolean;
  startTime?: string;
  endTime?: string;
  isoDate?: string;
}

type ExperienceType =
  | "ONE_TO_TWO_YEARS"
  | "TWO_TO_THREE_YEARS"
  | "THREE_TO_FOUR_YEARS"
  | "FOUR_TO_TEN_YEARS";

const STEPS = ["Professional Info", "Documents", "Schedule", "Preferences"];

export default function useProviderProfile() {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [phone, setPhone] = useState<string | undefined>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showTimePickerInternal, setShowTimePickerInternal] = useState(false);
  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [stepsCount, setStepsCount] = useState<number>(50);
  const [onChange, setOnChange] = useState<boolean>(false);
  const [agreeToTamsPolice, setAgreeToTamsPolice] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<boolean>(false);
  const [professionalInfo, setProfessionalInfo] = useState<any>(null);
  const [experience, setExperience] = useState<ExperienceType | null>(null);

  const [stepData, setStepData] = useState<{
    professionalInfo: any;
    documents: UploadFile[];
    schedule: DaySchedule[];
    preferences: any;
  }>({
    professionalInfo: null,
    documents: [],
    schedule: [],
    preferences: null,
  });

  const { data: profileData } = useGetProviderProfileQuery(undefined);
  const [updateProviderProfile, { isLoading: updating }] =
    useUpdateProviderProfileMutation();

  const [schedule, setSchedule] = useState<DaySchedule[]>(() => {
    const now = dayjs();
    const daysInMonth = now.daysInMonth();
    const days: DaySchedule[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dayMoment = now.date(day);
      days.push({
        date: dayMoment.format("dddd, MMMM D"),
        dayName: dayMoment.format("ddd"),
        dayNumber: dayMoment.date(),
        available: false,
        startTime: undefined,
        endTime: undefined,
        isoDate: dayMoment.startOf("day").format(),
      });
    }
    return days;
  });

  // Load saved step data on step change
  useEffect(() => {
    if (stepData.professionalInfo && currentStep === 0) {
      form.setFieldsValue(stepData.professionalInfo);
      if (stepData.professionalInfo.phone)
        setPhone(stepData.professionalInfo.phone);
    }

    if (stepData.documents.length > 0 && currentStep === 1) {
      setFileList(stepData.documents);
    }

    if (stepData.schedule.length > 0 && currentStep === 2) {
      setSchedule(stepData.schedule);
      setSelectedDate(stepData.schedule[0]?.date || "");
    }

    if (stepData.preferences && currentStep === 3) {
      setStepsCount(stepData.preferences.stepsCount || 50);
      setOnChange(stepData.preferences.onChange || false);
      setAgreeToTamsPolice(stepData.preferences.agreeToTamsPolice || false);
      if (stepData.preferences.mdDoCredentials) {
        form.setFieldsValue({
          mdDoCredentials: stepData.preferences.mdDoCredentials,
        });
      }
    }
  }, [currentStep]);

  // Load profile data
  useEffect(() => {
    const providerProfile = profileData?.result?.providerProfile;
    if (!providerProfile) return;

    const initialProfessional = {
      provider: providerProfile.provider || [],
      nip_number: providerProfile.npiNumber ?? "",
      license_number: providerProfile.licenceNumber ?? "",
      certification: providerProfile.certification ?? [],
      state_licensed: providerProfile.stateLicenced ?? [],
      fullAddress: providerProfile.address?.fullAddress ?? "",
      long: providerProfile.address?.long ?? "0",
      lat: providerProfile.address?.lat ?? "0",
      phoneNumber: providerProfile.phoneNumber ?? "",
      experience: providerProfile.experience ?? null,
    };

    setProfessionalInfo(initialProfessional);
    setPhone(initialProfessional.phoneNumber);
    setExperience(initialProfessional.experience);

    setStepData((prev) => ({
      ...prev,
      professionalInfo: initialProfessional,
    }));

    form.setFieldsValue({
      provider: initialProfessional.provider,
      nip_number: initialProfessional.nip_number,
      license_number: initialProfessional.license_number,
      certification: initialProfessional.certification,
      state_licensed: initialProfessional.state_licensed,
      fullAddress: initialProfessional.fullAddress,
      phone: initialProfessional.phoneNumber,
      experience: initialProfessional.experience,
    });

    // Map provider availability
    if (providerProfile.providerAvailability?.length) {
      const mapped: DaySchedule[] = [];
      const daysInMonth = dayjs().daysInMonth();
      for (let day = 1; day <= daysInMonth; day++) {
        const dayMoment = dayjs().date(day);
        const isoDate = dayMoment.startOf("day").format();
        const display = dayMoment.format("dddd, MMMM D");

        const availability = providerProfile.providerAvailability.find(
          (a: any) => dayjs(a.date).isSame(dayMoment, "day"),
        );

        const start = availability?.startTime
          ? dayjs(availability.startTime).format("hh:mm A")
          : undefined;
        const end = availability?.endTime
          ? dayjs(availability.endTime).format("hh:mm A")
          : undefined;

        mapped.push({
          date: display,
          isoDate,
          dayName: dayMoment.format("ddd"),
          dayNumber: dayMoment.date(),
          available: !!availability?.availability,
          startTime: start,
          endTime: end,
        });
      }

      setSchedule(mapped);
      setSelectedDate(mapped[0]?.date || "");

      setStepData((prev) => ({
        ...prev,
        schedule: mapped,
      }));
    }

    const radius = providerProfile.radius ?? 50;
    const callRequest = providerProfile.callRequest ?? false;

    setStepsCount(radius);
    setOnChange(callRequest);

    setStepData((prev) => ({
      ...prev,
      preferences: {
        stepsCount: radius,
        onChange: callRequest,
        agreeToTamsPolice: false,
      },
    }));

    // Load documents
    if (providerProfile.document?.length) {
      const docs = providerProfile.document.map((d: any, i: number) => ({
        uid: `${i}`,
        name: d.fileName || `doc-${i}`,
        status: "done",
        url: d.url,
      }));
      setFileList(docs);
      setStepData((prev) => ({ ...prev, documents: docs }));
    }
  }, [profileData, form]);

  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const toggleAvailability = useCallback((index: number) => {
    setSchedule((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              available: !item.available,
              startTime: item.startTime || "09:00 AM",
              endTime: item.endTime || "05:00 PM",
            }
          : item,
      ),
    );
  }, []);

  const handleSaveTimes = (
    index: number,
    startTime: string,
    endTime: string,
  ) => {
    const start = dayjs(startTime, "hh:mm A");
    const end = dayjs(endTime, "hh:mm A");

    if (!end.isAfter(start)) {
      toast.error("End time must be after start time");
      return;
    }

    setSchedule((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, startTime, endTime, available: true } : item,
      ),
    );

    setShowTimePickerInternal(false);
    setEditingDayIndex(null);
  };

  const getISODateForSchedule = (item: DaySchedule, idx: number) => {
    if (item.isoDate && dayjs(item.isoDate).isValid()) return item.isoDate;
    const year = dayjs().year();
    const parsed = dayjs(`${item.date} ${year}`, "dddd, MMMM D YYYY", true);
    if (parsed.isValid()) return parsed.startOf("day").format();
    return dayjs().startOf("week").add(idx, "day").startOf("day").format();
  };

  const buildProviderAvailabilityLocal = useCallback(() => {
    return schedule.map((item, i) => {
      const isoDate = getISODateForSchedule(item, i);

      if (!item.available || !item.startTime || !item.endTime) {
        return {
          date: isoDate,
          startTime: isoDate,
          endTime: isoDate,
          availability: false,
        };
      }

      const dateLocal = dayjs(isoDate);
      const startTimeParsed = dayjs(
        `${dateLocal.format("YYYY-MM-DD")} ${item.startTime}`,
        "YYYY-MM-DD hh:mm A",
      );
      const endTimeParsed = dayjs(
        `${dateLocal.format("YYYY-MM-DD")} ${item.endTime}`,
        "YYYY-MM-DD hh:mm A",
      );

      if (!endTimeParsed.isAfter(startTimeParsed))
        throw new Error(`End time must be after start time for ${item.date}`);

      return {
        date: isoDate,
        startTime: startTimeParsed.format(),
        endTime: endTimeParsed.format(),
        availability: true,
      };
    });
  }, [schedule]);

  const handleProfileSatUpStepOne = async (values: any) => {
    try {
      await form.validateFields();
      const stepOneData = {
        ...values,
        phone: values.phone || phone,
        experience: values.experience || experience,
      };
      setProfessionalInfo(stepOneData);
      setStepData((prev) => ({ ...prev, professionalInfo: stepOneData }));
      if (values.experience) setExperience(values.experience);
      goToNextStep();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleDocumentUpload = async () => {
    if (!fileList || fileList.length === 0) {
      toast.error("Please upload at least one document");
      return;
    }
    setStepData((prev) => ({ ...prev, documents: fileList }));
    goToNextStep();
  };

  const handleSchedule = () => {
    setStepData((prev) => ({ ...prev, schedule }));
    goToNextStep();
  };

  async function geocodeAddress(fullAddress: string) {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) throw new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");

    const url =
      "https://maps.googleapis.com/maps/api/geocode/json" +
      `?address=${encodeURIComponent(fullAddress)}` +
      `&key=${key}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK" || !data.results?.length) {
      throw new Error(data.error_message || "Unable to geocode this address");
    }

    const { lat, lng } = data.results[0].geometry.location as {
      lat: number;
      lng: number;
    };

    return { lat: String(lat), long: String(lng) };
  }

  // === FIX: Correctly map state licensed ===
  const handleProfileSatUpStepTow = async (values: any) => {
    try {
      if (!professionalInfo)
        return toast.error("Please fill professional info first");
      if (!fileList?.length) return toast.error("Document is required");
      if (!experience) return toast.error("Please select your experience");

      const docFile =
        (fileList[0] as any).originFileObj || (fileList[0] as unknown as File);
      if (!docFile) return toast.error("Please upload a valid document");

      const providerVal = Array.isArray(professionalInfo.provider)
        ? professionalInfo.provider
        : typeof professionalInfo.provider === "string"
          ? [professionalInfo.provider]
          : [];

      const certifications = (professionalInfo.certification || []).map(
        toUpper,
      );

      // ✅ Map states to backend enum
      const validStateLicenced = (professionalInfo.state_licensed || [])
        .map((state: string) => {
          const key = state.replace(/\s+/g, "_").toUpperCase();
          return StateLicence[key as keyof typeof StateLicence];
        })
        .filter(Boolean); // remove invalid values

      let geoLat = professionalInfo.lat ?? "0";
      let geoLong = professionalInfo.long ?? "0";

      const fullAddress = professionalInfo.fullAddress?.trim() || "";

      if (fullAddress) {
        try {
          const { lat, long } = await geocodeAddress(fullAddress);
          geoLat = lat;
          geoLong = long;

          // optional: keep local state in sync
          setProfessionalInfo((prev: any) => ({
            ...prev,
            lat: lat,
            long: long,
          }));
        } catch (e: any) {
          // If you want to BLOCK submit when geocode fails, return here:
          // toast.error(e?.message || "Failed to geocode address"); return;

          toast.error(
            e?.message || "Failed to get latitude/longitude from address",
          );
        }
      }

      const address = {
        fullAddress,
        lat: geoLat,
        long: geoLong,
      };

      let providerAvailability = [];
      try {
        providerAvailability = buildProviderAvailabilityLocal();
      } catch (err: any) {
        toast.error(err.message || "Schedule validation failed");
        return;
      }

      const validProviders = providerVal.map((p: string) =>
        p === "MD/DO" || p === "MD_DO" ? "MD_DO" : p,
      );

      const bodyData: any = {
        provider: validProviders,
        npiNumber: professionalInfo.nip_number ?? "",
        licenceNumber: professionalInfo.license_number ?? "",
        certification: certifications,
        stateLicenced: validStateLicenced,
        address,
        phoneNumber: professionalInfo.phone ?? phone,
        experience,
        radius: stepsCount ?? 50,
        callRequest: onChange ?? false,
        providerAvailability,
        caseTypePreference: (values?.mdDoCredentials || []).map(toUpper),
      };

      const resp: any = await updateProviderProfile({
        bodyData,
        document: docFile,
        profileImage: undefined,
      }).unwrap();

      if (resp?.success) {
        toast.success(resp.message || "Profile updated successfully");
        setSubmitMessage(true);
      } else {
        toast.error(resp?.message || "Update failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  const closeSubmitMessage = () => setSubmitMessage(false);

  const credential = STEPS[currentStep];
  const progressValue = currentStep + 1;

  const ui = useMemo(
    () => ({
      initialProfessional: stepData.professionalInfo || professionalInfo,
      fileList,
      schedule,
      selectedDate,
      showTimePicker: showTimePickerInternal,
      editingDayIndex,
      stepsCount,
      onChange,
      agreeToTamsPolice,
      submitMessage,
      experience,
      updating,
      form,
      currentStep,
      canGoBack: currentStep > 0,
      canGoNext: currentStep < STEPS.length - 1,
    }),
    [
      stepData,
      professionalInfo,
      fileList,
      schedule,
      selectedDate,
      showTimePickerInternal,
      editingDayIndex,
      stepsCount,
      onChange,
      agreeToTamsPolice,
      submitMessage,
      experience,
      updating,
      form,
      currentStep,
    ],
  );

  const handlers = useMemo(
    () => ({
      handleProfileSatUpStepOne,
      handleDocumentUpload,
      handleSchedule,
      handleProfileSatUpStepTow,
      setFileList,
      setSelectedDate,
      toggleAvailability,
      setEditingDayIndex,
      setShowTimePicker: setShowTimePickerInternal,
      setExperience,
      setStepsCount,
      setOnChange,
      setAgreeToTamsPolice,
      closeSubmitMessage,
      setProfessionalInfo,
      setPhone,
      goToNextStep,
      goToPreviousStep,
    }),
    [
      handleProfileSatUpStepOne,
      handleDocumentUpload,
      handleSchedule,
      handleProfileSatUpStepTow,
      toggleAvailability,
    ],
  );

  const scheduleModalProps = {
    showTimePicker: ui.showTimePicker,
    setShowTimePicker: setShowTimePickerInternal,
    editingDayIndex,
    setEditingDayIndex,
    scheduleItem: editingDayIndex !== null ? schedule[editingDayIndex] : null,
    editingIndex: editingDayIndex,
    onSaveTimes: handleSaveTimes,
  };

  return {
    credential,
    progressValue,
    form,
    ui,
    handlers,
    scheduleModalProps,
  };
}
