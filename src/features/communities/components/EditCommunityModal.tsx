import CommunityForm from "./CommunityForm";
import Modal from "@/features/common/components/Modal";

type Props = {
    community: Community;
    closeModal: () => void;
}

const EditCommunityModal = ({ closeModal, community }: Props) => {
    return (
        <Modal closeModal={closeModal} title="Edit Community">
            <CommunityForm closeModal={closeModal} community={community}  />
        </Modal>
    );
}

export default EditCommunityModal;