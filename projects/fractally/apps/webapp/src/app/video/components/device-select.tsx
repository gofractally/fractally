// import { Form: {Select} } from "@fractally/components/ui";
import { Form } from "@fractally/components/ui";

const { Select } = Form;

interface Props {
    devices: MediaDeviceInfo[];
    onChange: (value: string) => void;
    deviceName: string;
}

export const DeviceSelect = ({
    devices = [],
    onChange = (value) => {},
    deviceName = "device",
}: Props) => {
    return (
        <Select
            onChange={async (e) => {
                const target = e.target as HTMLSelectElement;
                if (target.value !== "") onChange(target.value);
            }}
            defaultValue=""
        >
            <option value="" disabled hidden>
                Change {deviceName}
            </option>
            {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                </option>
            ))}
        </Select>
    );
};

export default DeviceSelect;
