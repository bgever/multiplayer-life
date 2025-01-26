export interface ClientSideEvents {
	join: (guid: string) => void;
	leave: (guid: string) => void;
}