import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './Dashboard';

const CreatePolls = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    options: ['', ''],
    expiresAt: '',
    isPublic: true,
    allowMultipleVotes: false,
    allowComments: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData({
      ...formData,
      options: updatedOptions
    });
  };

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData({
        ...formData,
        options: [...formData.options, '']
      });
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const updatedOptions = formData.options.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        options: updatedOptions
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    const validOptions = formData.options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create unique ID for the poll
      const pollId = 'poll_' + Date.now();
      
      // Get user information
      const userData = JSON.parse(localStorage.getItem('user'));
      
      // Create poll object
      const newPoll = {
        id: pollId,
        title: formData.title,
        description: formData.description,
        options: formData.options.filter(option => option.trim() !== '').map(option => ({
          text: option,
          votes: 0
        })),
        createdAt: new Date().toISOString(),
        expiresAt: formData.expiresAt || null,
        isPublic: formData.isPublic,
        allowMultipleVotes: formData.allowMultipleVotes,
        allowComments: formData.allowComments,
        author: userData.name,
        authorId: userData.id,
        totalVotes: 0,
        voters: []
      };
      
      // Save the poll to local storage for demo purposes
      // In a real app, this would be a backend API call
      const existingPolls = JSON.parse(localStorage.getItem('polls') || '[]');
      localStorage.setItem('polls', JSON.stringify([...existingPolls, newPoll]));
      
      // Save to user's polls
      const userPolls = JSON.parse(localStorage.getItem('userPolls') || '[]');
      localStorage.setItem('userPolls', JSON.stringify([...userPolls, newPoll]));
      
      // Redirect to the newly created poll
      navigate('/mypolls');
    } catch (error) {
      console.error('Error creating poll:', error);
      setErrors({ general: 'Failed to create poll. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a New Poll</h1>
        
        {errors.general && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {/* Poll Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Poll Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter a clear, specific question"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          {/* Poll Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Provide additional context for your poll"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          {/* Poll Options */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Options</label>
            {errors.options && <p className="text-red-500 text-sm mb-2">{errors.options}</p>}
            
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  id={`option-${index}`}
                  name={`option-${index}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={`Option ${index + 1}`}
                  aria-label={`Option ${index + 1}`}
                />
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    aria-label={`Remove option ${index + 1}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            
            {formData.options.length < 10 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Another Option
              </button>
            )}
          </div>
          
          {/* Poll Settings */}
          <div className="mb-6 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Poll Settings</h3>
            
            {/* Expiration Date */}
            <div className="mb-4">
              <label htmlFor="expiresAt" className="block text-gray-700 font-medium mb-2">Expiration Date (Optional)</label>
              <input
                type="datetime-local"
                id="expiresAt"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <p className="text-gray-500 text-sm mt-1">Leave blank for no expiration</p>
            </div>
            
            {/* Poll Visibility */}
            <div className="mb-4">
              <label htmlFor="isPublic" className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Make poll public</span>
              </label>
              <p className="text-gray-500 text-sm mt-1 ml-6">Public polls can be discovered by all users</p>
            </div>
            
            {/* Multiple Votes */}
            <div className="mb-4">
              <label htmlFor="allowMultipleVotes" className="flex items-center">
                <input
                  type="checkbox"
                  id="allowMultipleVotes"
                  name="allowMultipleVotes"
                  checked={formData.allowMultipleVotes}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Allow multiple options selection</span>
              </label>
            </div>
            
            {/* Allow Comments */}
            <div className="mb-4">
              <label htmlFor="allowComments" className="flex items-center">
                <input
                  type="checkbox"
                  id="allowComments"
                  name="allowComments"
                  checked={formData.allowComments}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Enable comments</span>
              </label>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Creating...' : 'Create Poll'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreatePolls;